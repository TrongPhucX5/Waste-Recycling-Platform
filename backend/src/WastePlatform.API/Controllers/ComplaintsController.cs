using System.Security.Claims;
using MediatR;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.SignalR;
using Microsoft.AspNetCore.Mvc;
using WastePlatform.Application.Complaints.Commands;
using WastePlatform.Application.Complaints.Queries;
using WastePlatform.Application.Common.DTOs;
using WastePlatform.Domain.Enums;

namespace WastePlatform.API.Controllers;

[ApiController]
[Route("api/complaints")]
[Authorize(Roles = "Citizen")]
public class ComplaintsController : ControllerBase
{
    private readonly IMediator _mediator;
    private readonly Microsoft.AspNetCore.SignalR.IHubContext<WastePlatform.API.Hubs.TaskHub> _hubContext;
    private readonly WastePlatform.Application.Common.Interfaces.IEnterpriseRepository _enterpriseRepository;

    public ComplaintsController(IMediator mediator, Microsoft.AspNetCore.SignalR.IHubContext<WastePlatform.API.Hubs.TaskHub> hubContext, WastePlatform.Application.Common.Interfaces.IEnterpriseRepository enterpriseRepository)
    {
        _mediator = mediator;
        _hubContext = hubContext;
        _enterpriseRepository = enterpriseRepository;
    }

    /// <summary>Create a new complaint</summary>
    [HttpPost]
    public async Task<IActionResult> CreateComplaint([FromBody] CreateComplaintDto dto)
    {
        try
        {
            var userId = GetUserId();
            if (userId == Guid.Empty)
                return Unauthorized(new { message = "Invalid or missing user ID in token" });

            if (string.IsNullOrWhiteSpace(dto.Content))
                return BadRequest(new { message = "Complaint content cannot be empty" });

            var complaintId = await _mediator.Send(new CreateComplaintCommand
            {
                CitizenId = userId,
                Content = dto.Content,
                ReportId = dto.ReportId
            });

            var complaint = await _mediator.Send(new GetComplaintByIdQuery { Id = complaintId });

            // Notify Admins and Enterprises about the new complaint (best-effort)
            try
            {
                var payload = new {
                    id = complaintId,
                    reportId = complaint?.ReportId,
                    content = complaint?.Content,
                    citizen = complaint?.CitizenName,
                    createdAt = complaint?.CreatedAt
                };

                // Notify Admins
                await _hubContext.Clients.Group("Admins").SendAsync("NewComplaint", payload);

                // Try to target enterprises that handle the report's waste category
                try
                {
                    if (complaint?.ReportId != null)
                    {
                        var report = await _mediator.Send(new WastePlatform.Application.Reports.Queries.GetReportByIdQuery { Id = complaint.ReportId.Value });
                        if (report != null && report.WasteCategoryId.HasValue)
                        {
                            var matchingEnterprises = await _enterpriseRepository.GetEnterprisesByWasteCategoryAsync(report.WasteCategoryId.Value, HttpContext.RequestAborted);
                            if (matchingEnterprises != null && matchingEnterprises.Any())
                            {
                                foreach (var en in matchingEnterprises)
                                {
                                    await _hubContext.Clients.Group($"Enterprise-{en.Id}").SendAsync("NewComplaint", payload);
                                }
                            }
                            else
                            {
                                // Fallback broadcast to all enterprises
                                await _hubContext.Clients.Group("Enterprises").SendAsync("NewComplaint", payload);
                            }
                        }
                        else
                        {
                            await _hubContext.Clients.Group("Enterprises").SendAsync("NewComplaint", payload);
                        }
                    }
                    else
                    {
                        await _hubContext.Clients.Group("Enterprises").SendAsync("NewComplaint", payload);
                    }
                }
                catch
                {
                    // best-effort: don't fail complaint creation if notifications fail
                }
            }
            catch
            {
                // don't fail the request if hub notify fails
            }

            return CreatedAtAction(nameof(GetComplaintDetail), new { id = complaintId }, new
            {
                message = "Complaint created successfully",
                data = complaint
            });
        }
        catch (ArgumentException ex)
        {
            return BadRequest(new { message = ex.Message });
        }
        catch (Exception ex)
        {
            return StatusCode(500, new { message = "Internal server error", error = ex.Message });
        }
    }

    /// <summary>Get citizen's complaints with pagination</summary>
    [HttpGet]
    public async Task<IActionResult> GetComplaints([FromQuery] int page = 1, [FromQuery] int pageSize = 10, [FromQuery] ComplaintStatus? status = null)
    {
        try
        {
            var userId = GetUserId();
            if (userId == Guid.Empty)
                return Unauthorized(new { message = "Invalid or missing user ID in token" });

            if (page < 1 || pageSize < 1)
                return BadRequest(new { message = "Page and PageSize must be greater than 0" });

            var result = await _mediator.Send(new GetCitizenComplaintsQuery
            {
                CitizenId = userId,
                Page = page,
                PageSize = pageSize,
                Status = status
            });

            return Ok(new
            {
                message = "Complaints retrieved successfully",
                data = result
            });
        }
        catch (Exception ex)
        {
            return StatusCode(500, new { message = "Internal server error", error = ex.Message });
        }
    }

    /// <summary>Get complaint detail by ID</summary>
    [HttpGet("{id}")]
    public async Task<IActionResult> GetComplaintDetail(Guid id)
    {
        try
        {
            var userId = GetUserId();
            if (userId == Guid.Empty)
                return Unauthorized(new { message = "Invalid or missing user ID in token" });

            var complaint = await _mediator.Send(new GetComplaintByIdQuery { Id = id });

            if (complaint == null)
                return NotFound(new { message = "Complaint not found" });

            // Check authorization - citizen can only view their own complaints
            if (complaint.CitizenId != userId)
                return Forbid();

            return Ok(new
            {
                message = "Complaint retrieved successfully",
                data = complaint
            });
        }
        catch (Exception ex)
        {
            return StatusCode(500, new { message = "Internal server error", error = ex.Message });
        }
    }

    private Guid GetUserId()
    {
        var userIdClaim = User.FindFirst(ClaimTypes.NameIdentifier);
        if (userIdClaim == null || !Guid.TryParse(userIdClaim.Value, out var userId))
            return Guid.Empty;
        return userId;
    }
}
