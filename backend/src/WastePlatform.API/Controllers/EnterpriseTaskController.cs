using System.Security.Claims;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using WastePlatform.Domain.Entities;
using WastePlatform.Domain.Enums;
using WastePlatform.Infrastructure.Persistence;

namespace WastePlatform.API.Controllers;

[ApiController]
[Route("api/enterprise/tasks")]
[Authorize(Roles = "Enterprise")]
public class EnterpriseTaskController : ControllerBase
{
    private readonly WastePlatformDbContext _context;

    public EnterpriseTaskController(WastePlatformDbContext context)
    {
        _context = context;
    }

    private async Task<Enterprise?> GetCurrentEnterpriseAsync()
    {
        var userIdClaim = User.FindFirst(ClaimTypes.NameIdentifier);
        if (userIdClaim == null || !Guid.TryParse(userIdClaim.Value, out var userId))
            return null;

        return await _context.Enterprises
            .Include(e => e.User)
            .FirstOrDefaultAsync(e => e.UserId == userId);
    }

    /// <summary>
    /// Lấy danh sách nhiệm vụ thu gom của Enterprise (có thể chưa gán Collector)
    /// </summary>
    [HttpGet]
    public async Task<IActionResult> GetTasks([FromQuery] CollectionTaskStatus? status = null, [FromQuery] bool? unassigned = null)
    {
        var enterprise = await GetCurrentEnterpriseAsync();
        if (enterprise == null)
            return Unauthorized(new { message = "Enterprise profile not found for current user." });

        var query = _context.CollectionTasks
            .Include(t => t.WasteReport)
                .ThenInclude(r => r.WasteCategory)
            .Include(t => t.WasteReport)
                .ThenInclude(r => r.Citizen)
            .Include(t => t.Collector!)
                .ThenInclude(c => c.User)
            .Include(t => t.Images)
            .Where(t => t.EnterpriseId == enterprise.Id);

        // Filter by unassigned status if requested
        if (unassigned == true)
        {
            query = query.Where(t => t.CollectorId == null);
        }

        // Filter by status if provided
        if (status.HasValue)
        {
            query = query.Where(t => t.Status == status.Value);
        }

        var tasks = await query
            .OrderByDescending(t => t.AssignedAt)
            .Select(t => new
            {
                t.Id,
                t.ReportId,
                t.EnterpriseId,
                t.CollectorId,
                CollectorName = t.Collector != null ? t.Collector.User.FullName : null,
                CollectorPhone = t.Collector != null ? t.Collector.User.Phone : null,
                Status = t.Status.ToString(),
                t.CollectedWeightKg,
                t.Notes,
                t.AssignedAt,
                t.CompletedAt,
                Report = new
                {
                    t.WasteReport.Id,
                    t.WasteReport.Description,
                    t.WasteReport.Address,
                    t.WasteReport.Latitude,
                    t.WasteReport.Longitude,
                    Status = t.WasteReport.Status.ToString(),
                    CategoryName = t.WasteReport.WasteCategory != null ? t.WasteReport.WasteCategory.Name : null,
                    CitizenName = t.WasteReport.Citizen.FullName,
                    CitizenPhone = t.WasteReport.Citizen.Phone
                }
            })
            .ToListAsync();

        return Ok(tasks);
    }

    /// <summary>
    /// Gán Collector cho một nhiệm vụ thu gom
    /// </summary>
    [HttpPut("{id}/assign-collector")]
    public async Task<IActionResult> AssignCollector(Guid id, [FromBody] AssignCollectorRequest request)
    {
        var enterprise = await GetCurrentEnterpriseAsync();
        if (enterprise == null)
            return Unauthorized(new { message = "Enterprise profile not found." });

        if (request.CollectorId == Guid.Empty)
            return BadRequest(new { message = "CollectorId is required." });

        var task = await _context.CollectionTasks
            .FirstOrDefaultAsync(t => t.Id == id && t.EnterpriseId == enterprise.Id);

        if (task == null)
            return NotFound(new { message = "Task not found or does not belong to this enterprise." });

        // Verify collector belongs to this enterprise
        var collector = await _context.Collectors
            .FirstOrDefaultAsync(c => c.Id == request.CollectorId && c.EnterpriseId == enterprise.Id);

        if (collector == null)
            return BadRequest(new { message = "Collector not found or does not belong to this enterprise." });

        try
        {
            task.AssignCollector(request.CollectorId);
            await _context.SaveChangesAsync();

            return Ok(new 
            { 
                message = "Collector assigned successfully.", 
                taskId = id,
                collectorId = request.CollectorId
            });
        }
        catch (InvalidOperationException ex)
        {
            return BadRequest(new { message = ex.Message });
        }
    }

    /// <summary>
    /// Lấy danh sách Collectors của Enterprise (có thể gán công việc)
    /// </summary>
    [HttpGet("collectors")]
    public async Task<IActionResult> GetAvailableCollectors()
    {
        var enterprise = await GetCurrentEnterpriseAsync();
        if (enterprise == null)
            return Unauthorized(new { message = "Enterprise profile not found." });

        var collectors = await _context.Collectors
            .Include(c => c.User)
            .Where(c => c.EnterpriseId == enterprise.Id)
            .OrderBy(c => c.User.FullName)
            .Select(c => new
            {
                c.Id,
                Name = c.User.FullName,
                Email = c.User.Email,
                Phone = c.User.Phone,
                c.IsAvailable,
                c.CreatedAt,
                TaskCount = c.CollectionTasks.Count(t => t.Status != CollectionTaskStatus.Collected)
            })
            .ToListAsync();

        return Ok(collectors);
    }

    /// <summary>
    /// Lấy thống kê công việc của Enterprise
    /// </summary>
    [HttpGet("stats")]
    public async Task<IActionResult> GetStats()
    {
        var enterprise = await GetCurrentEnterpriseAsync();
        if (enterprise == null)
            return Unauthorized(new { message = "Enterprise profile not found." });

        var tasks = await _context.CollectionTasks
            .Where(t => t.EnterpriseId == enterprise.Id)
            .Include(t => t.WasteReport)
            .ToListAsync();

        var totalUnassigned = tasks.Count(t => t.CollectorId == null);
        var totalAssigned = tasks.Count(t => t.Status == CollectionTaskStatus.Assigned);
        var totalOnTheWay = tasks.Count(t => t.Status == CollectionTaskStatus.OnTheWay);
        var totalCollected = tasks.Count(t => t.Status == CollectionTaskStatus.Collected);
        var totalWeight = tasks
            .Where(t => t.Status == CollectionTaskStatus.Collected && t.CollectedWeightKg.HasValue)
            .Sum(t => t.CollectedWeightKg!.Value);

        return Ok(new
        {
            TotalTasks = tasks.Count,
            TotalUnassigned = totalUnassigned,
            TotalAssigned = totalAssigned,
            TotalOnTheWay = totalOnTheWay,
            TotalCollected = totalCollected,
            TotalWeightKg = totalWeight
        });
    }
}

/// <summary>
/// Request body for assigning a collector to a task
/// </summary>
public class AssignCollectorRequest
{
    public Guid CollectorId { get; set; }
}
