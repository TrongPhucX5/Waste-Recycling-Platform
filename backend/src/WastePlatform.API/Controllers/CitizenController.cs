using System.Security.Claims;
using MediatR;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using WastePlatform.Application.Complaints.Commands;
using WastePlatform.Application.Complaints.Queries;
using WastePlatform.Application.Common.DTOs;
using WastePlatform.Application.Reports.Queries;
using WastePlatform.Application.Rewards.Queries;
using WastePlatform.Domain.Enums;

namespace WastePlatform.API.Controllers;

[ApiController]
[Route("api/citizens")]
[Authorize(Roles = "Citizen")]
public class CitizenController : ControllerBase
{
    private readonly IMediator _mediator;

    public CitizenController(IMediator mediator)
    {
        _mediator = mediator;
    }

    /// <summary>Get total reward points for current citizen</summary>
    [HttpGet("rewards")]
    public async Task<IActionResult> GetTotalRewards()
    {
        try
        {
            var userId = GetUserId();
            if (userId == Guid.Empty)
                return Unauthorized(new { message = "Invalid or missing user ID in token" });

            var result = await _mediator.Send(new GetTotalPointsQuery { CitizenId = userId });
            return Ok(new { message = "Total rewards retrieved successfully", data = result });
        }
        catch (Exception ex)
        {
            return StatusCode(500, new { message = "Internal server error", error = ex.Message });
        }
    }

    /// <summary>Get reward points history with pagination</summary>
    [HttpGet("rewards/history")]
    public async Task<IActionResult> GetRewardHistory([FromQuery] int page = 1, [FromQuery] int pageSize = 10)
    {
        try
        {
            var userId = GetUserId();
            if (userId == Guid.Empty)
                return Unauthorized(new { message = "Invalid or missing user ID in token" });

            if (page < 1 || pageSize < 1)
                return BadRequest(new { message = "Page and PageSize must be greater than 0" });

            var result = await _mediator.Send(new GetRewardHistoryQuery
            {
                CitizenId = userId,
                Page = page,
                PageSize = pageSize
            });

            return Ok(new
            {
                message = "Reward history retrieved successfully",
                data = result
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
