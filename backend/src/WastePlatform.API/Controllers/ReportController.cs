using System.Security.Claims;
using MediatR;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using WastePlatform.Application.Reports.Commands;
using WastePlatform.Application.Reports.Queries;
using WastePlatform.Domain.Enums;

namespace WastePlatform.API.Controllers;

[ApiController]
[Route("api/reports")]
[Authorize]
public class ReportController : ControllerBase
{
    private readonly IMediator _mediator;

    public ReportController(IMediator mediator)
    {
        _mediator = mediator;
    }

    /// <summary>Tạo báo cáo rác mới</summary>
    [HttpPost("create")]
    [Authorize(Roles = "Citizen")]
    public async Task<IActionResult> CreateReport([FromForm] IFormCollection form)
    {
        try
        {
            var userIdClaim = User.FindFirst(ClaimTypes.NameIdentifier);
            if (userIdClaim == null || !Guid.TryParse(userIdClaim.Value, out var userId))
                return Unauthorized(new { message = "Invalid or missing user ID in token" });

            if (!int.TryParse(form["WasteCategoryId"], out var categoryId))
                return BadRequest(new { message = "Invalid WasteCategoryId" });

            if (!decimal.TryParse(form["Latitude"], out var latitude))
                return BadRequest(new { message = "Invalid Latitude" });

            if (!decimal.TryParse(form["Longitude"], out var longitude))
                return BadRequest(new { message = "Invalid Longitude" });

            var command = new CreateReportCommand
            {
                CitizenId = userId,
                WasteCategoryId = categoryId,
                Latitude = latitude,
                Longitude = longitude,
                Description = form["Description"].ToString(),
                Address = form["Address"].ToString(),
                AiSuggestion = form["AiSuggestion"].ToString(),
                Images = form.Files
            };

            var reportId = await _mediator.Send(command);

            // Re-use GetReportByIdQuery to construct the response DTO natively
            var createdReportDto = await _mediator.Send(new GetReportByIdQuery { Id = reportId });

            var response = new
            {
                message = "Report created successfully",
                report = createdReportDto
            };

            return CreatedAtAction(nameof(GetReportById), new { id = reportId }, response);
        }
        catch (ArgumentException ex)
        {
            return BadRequest(new { message = ex.Message });
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

    /// <summary>Lấy chi tiết báo cáo theo ID</summary>
    [HttpGet("{id}")]
    public async Task<IActionResult> GetReportById(Guid id)
    {
        try
        {
            var report = await _mediator.Send(new GetReportByIdQuery { Id = id });

            if (report == null)
                return NotFound(new { message = "Report not found" });

            return Ok(new { message = "Report retrieved successfully", report = report });
        }
        catch (Exception ex)
        {
            return StatusCode(500, new { message = "Internal server error", error = ex.Message });
        }
    }

    /// <summary>Lấy danh sách báo cáo của người dùng hiện tại</summary>
    [HttpGet("my-reports")]
    public async Task<IActionResult> GetMyReports([FromQuery] int page = 1, [FromQuery] int pageSize = 10)
    {
        try
        {
            var userIdClaim = User.FindFirst(ClaimTypes.NameIdentifier);
            if (userIdClaim == null || !Guid.TryParse(userIdClaim.Value, out var userId))
                return Unauthorized(new { message = "Invalid or missing user ID" });

            var result = await _mediator.Send(new GetMyReportsQuery 
            { 
                UserId = userId, 
                Page = page, 
                PageSize = pageSize 
            });

            var response = new
            {
                message = "Reports retrieved successfully",
                pagination = new
                {
                    page = page,
                    pageSize = pageSize,
                    total = result.Total,
                    totalPages = result.TotalPages
                },
                reports = result.Reports
            };

            return Ok(response);
        }
        catch (Exception ex)
        {
            return StatusCode(500, new { message = "Internal server error", error = ex.Message });
        }
    }

    /// <summary>Lấy danh sách tất cả báo cáo (Admin/Enterprise)</summary>
    [HttpGet("all")]
    [Authorize(Roles = "Admin,Enterprise")]
    public async Task<IActionResult> GetAllReports([FromQuery] int page = 1, [FromQuery] int pageSize = 10, [FromQuery] string? status = null)
    {
        try
        {
            var result = await _mediator.Send(new GetAllReportsQuery 
            { 
                Page = page, 
                PageSize = pageSize, 
                Status = status 
            });

            var response = new
            {
                message = "All reports retrieved successfully",
                pagination = new
                {
                    page = page,
                    pageSize = pageSize,
                    total = result.Total,
                    totalPages = result.TotalPages
                },
                reports = result.Reports
            };

            return Ok(response);
        }
        catch (Exception ex)
        {
            return StatusCode(500, new { message = "Internal server error", error = ex.Message });
        }
    }
}
