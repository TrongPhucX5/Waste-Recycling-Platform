using System.Security.Claims;
using MediatR;
using System.Text.Json;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using WastePlatform.Domain.Entities;
using WastePlatform.Domain.Enums;
using WastePlatform.Infrastructure.Persistence;

namespace WastePlatform.API.Controllers;

[ApiController]
[Route("api/enterprise/complaints")]
[Authorize(Roles = "Enterprise")]
public class EnterpriseComplaintsController : ControllerBase
{
    private readonly WastePlatformDbContext _context;

    public EnterpriseComplaintsController(WastePlatformDbContext context)
    {
        _context = context;
    }

    [HttpGet]
    public async Task<IActionResult> GetComplaints([FromQuery] int page = 1, [FromQuery] int pageSize = 10, [FromQuery] string? status = null)
    {
        try
        {
            var userIdClaim = User.FindFirst(ClaimTypes.NameIdentifier);
            if (userIdClaim == null || !Guid.TryParse(userIdClaim.Value, out var userId))
                return Unauthorized(new { message = "Invalid or missing user ID in token" });

            var enterprise = await _context.Enterprises.FirstOrDefaultAsync(e => e.UserId == userId);
            if (enterprise == null)
                return Unauthorized(new { message = "Enterprise profile not found for current user" });

            ComplaintStatus? statusEnum = null;
            if (!string.IsNullOrEmpty(status) && Enum.TryParse<ComplaintStatus>(status, true, out var parsed))
                statusEnum = parsed;

            // Complaints related to reports that this enterprise can handle
            var acceptedWasteCategoryIds = await _context.EnterpriseWasteTypes
                .Where(ewt => ewt.EnterpriseId == enterprise.Id)
                .Select(ewt => ewt.WasteCategoryId)
                .ToListAsync();

            var query = _context.Complaints
                .Include(c => c.WasteReport)
                .ThenInclude(r => r.WasteCategory)
                .Include(c => c.Citizen)
                .AsQueryable()
                .Where(c => c.ReportId != null && (
                    (c.WasteReport != null && c.WasteReport.WasteCategory != null && acceptedWasteCategoryIds.Contains(c.WasteReport.WasteCategory.Id))
                    || (c.WasteReport != null && c.WasteReport.CollectionTask != null && c.WasteReport.CollectionTask.EnterpriseId == enterprise.Id)
                ));

            if (statusEnum.HasValue)
                query = query.Where(c => c.Status == statusEnum.Value);

            var total = await query.CountAsync();

            var items = await query
                .OrderByDescending(c => c.CreatedAt)
                .Skip((page - 1) * pageSize)
                .Take(pageSize)
                .Select(c => new {
                    id = c.Id,
                    reportId = c.ReportId,
                    content = c.Content,
                    status = c.Status.ToString(),
                    adminResponse = c.AdminResponse,
                    citizenName = c.Citizen != null ? c.Citizen.FullName : null,
                    createdAt = c.CreatedAt
                })
                .ToListAsync();

            return Ok(new { message = "Complaints retrieved successfully", data = items, pagination = new { total } });
        }
        catch (Exception ex)
        {
            return StatusCode(500, new { message = "Internal server error", error = ex.Message });
        }
    }

    [HttpPost("{id}/resolve")]
    public async Task<IActionResult> ResolveComplaint(Guid id, [FromBody] ComplaintResponseRequest request)
    {
        try
        {
            if (string.IsNullOrWhiteSpace(request.AdminResponse))
                return BadRequest(new { message = "Response is required" });

            var userIdClaim = User.FindFirst(ClaimTypes.NameIdentifier);
            if (userIdClaim == null || !Guid.TryParse(userIdClaim.Value, out var userId))
                return Unauthorized(new { message = "Invalid or missing user ID in token" });

            var enterprise = await _context.Enterprises.FirstOrDefaultAsync(e => e.UserId == userId);
            if (enterprise == null)
                return Unauthorized(new { message = "Enterprise profile not found for current user" });

            var complaint = await _context.Complaints.Include(c => c.WasteReport).FirstOrDefaultAsync(c => c.Id == id);
            if (complaint == null)
                return NotFound(new { message = "Complaint not found" });

            if (complaint.ReportId == null)
                return BadRequest(new { message = "Cannot resolve complaint without an associated report" });

            var report = complaint.WasteReport!;
            if (report == null)
                return NotFound(new { message = "Related report not found" });

            // Check enterprise can handle this report (category + service area)
            var acceptedWasteCategoryIds = await _context.EnterpriseWasteTypes
                .Where(ewt => ewt.EnterpriseId == enterprise.Id)
                .Select(ewt => ewt.WasteCategoryId)
                .ToListAsync();

            if (!report.WasteCategoryId.HasValue || !acceptedWasteCategoryIds.Contains(report.WasteCategoryId.Value))
                return BadRequest(new { message = "This report's waste category is not handled by your enterprise." });

            var serviceAreaTerms = ParseServiceAreaValues(enterprise.ServiceArea);
            if (!IsReportInServiceArea(report, serviceAreaTerms))
                return BadRequest(new { message = "This report is outside your enterprise service area." });

            // If report is Pending, accept and create collection task for this enterprise
            if (report.Status == ReportStatus.Pending)
            {
                report.Accept();
                var collectionTask = CollectionTask.Create(report.Id, enterprise.Id);
                _context.CollectionTasks.Add(collectionTask);
            }

            // Mark complaint resolved
            complaint.Resolve(request.AdminResponse);

            _context.Complaints.Update(complaint);
            _context.WasteReports.Update(report);
            await _context.SaveChangesAsync();

            return Ok(new { message = "Complaint resolved and collection task created (if applicable)", complaintId = complaint.Id });
        }
        catch (InvalidOperationException ex)
        {
            return BadRequest(new { message = ex.Message });
        }
        catch (Exception ex)
        {
            return StatusCode(500, new { message = "Internal server error", error = ex.Message });
        }
    }

    [HttpPost("{id}/reject")]
    public async Task<IActionResult> RejectComplaint(Guid id, [FromBody] ComplaintResponseRequest request)
    {
        try
        {
            if (string.IsNullOrWhiteSpace(request.AdminResponse))
                return BadRequest(new { message = "Response is required" });

            var userIdClaim = User.FindFirst(ClaimTypes.NameIdentifier);
            if (userIdClaim == null || !Guid.TryParse(userIdClaim.Value, out var userId))
                return Unauthorized(new { message = "Invalid or missing user ID in token" });

            var enterprise = await _context.Enterprises.FirstOrDefaultAsync(e => e.UserId == userId);
            if (enterprise == null)
                return Unauthorized(new { message = "Enterprise profile not found for current user" });

            var complaint = await _context.Complaints.Include(c => c.WasteReport).FirstOrDefaultAsync(c => c.Id == id);
            if (complaint == null)
                return NotFound(new { message = "Complaint not found" });

            complaint.Reject(request.AdminResponse);
            _context.Complaints.Update(complaint);
            await _context.SaveChangesAsync();

            return Ok(new { message = "Complaint rejected", complaintId = complaint.Id });
        }
        catch (Exception ex)
        {
            return StatusCode(500, new { message = "Internal server error", error = ex.Message });
        }
    }

    private static IEnumerable<string> ParseServiceAreaValues(string? serviceArea)
    {
        if (string.IsNullOrWhiteSpace(serviceArea))
            return Array.Empty<string>();

        try
        {
            using var document = JsonDocument.Parse(serviceArea);
            if (document.RootElement.ValueKind == JsonValueKind.Array)
            {
                return document.RootElement.EnumerateArray()
                    .Where(e => e.ValueKind == JsonValueKind.String)
                    .Select(e => e.GetString()!.Trim())
                    .Where(value => !string.IsNullOrWhiteSpace(value))
                    .ToList();
            }

            if (document.RootElement.ValueKind == JsonValueKind.String)
            {
                var value = document.RootElement.GetString();
                return string.IsNullOrWhiteSpace(value)
                    ? Array.Empty<string>()
                    : new[] { value.Trim() };
            }
        }
        catch (JsonException)
        {
            // not valid JSON, fallback to comma-separated text
        }

        return serviceArea.Split(',', StringSplitOptions.RemoveEmptyEntries)
            .Select(value => value.Trim())
            .Where(value => !string.IsNullOrWhiteSpace(value))
            .ToList();
    }

    private static bool IsReportInServiceArea(WasteReport report, IEnumerable<string> serviceAreaTerms)
    {
        var terms = serviceAreaTerms.Where(value => !string.IsNullOrWhiteSpace(value)).ToList();
        if (!terms.Any())
            return true;

        if (!string.IsNullOrWhiteSpace(report.Address))
        {
            return terms.Any(term => report.Address.Contains(term, StringComparison.OrdinalIgnoreCase));
        }

        return false;
    }
}

// Reuse existing ComplaintResponseRequest from Admin controller to avoid duplicate type
