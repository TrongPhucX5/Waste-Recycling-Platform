using System.Security.Claims;
using MediatR;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using WastePlatform.Application.Enterprise.Commands;
using WastePlatform.Application.Common.Interfaces;
using WastePlatform.Domain.Enums;

namespace WastePlatform.API.Controllers;

[ApiController]
[Route("api/enterprise")]
[Authorize]
public class EnterpriseController : ControllerBase
{
    private readonly IMediator _mediator;
    private readonly IEnterpriseRepository _enterpriseRepository;

    public EnterpriseController(IMediator mediator, IEnterpriseRepository enterpriseRepository)
    {
        _mediator = mediator;
        _enterpriseRepository = enterpriseRepository;
    }

    /// <summary>Get current enterprise profile</summary>
    [HttpGet("me")]
    [Authorize(Policy = "RequireRole:Enterprise")]
    public async Task<IActionResult> GetMe(CancellationToken cancellationToken)
    {
        var userIdClaim = User.FindFirstValue(ClaimTypes.NameIdentifier) 
                          ?? User.FindFirstValue("sub");

        if (!Guid.TryParse(userIdClaim, out var userId))
            return Unauthorized(new { message = "Invalid user id in token" });

        try
        {
            var enterpriseDto = await _enterpriseRepository.GetEnterpriseByUserIdAsync(userId, cancellationToken);
            
            if (enterpriseDto == null)
                return NotFound(new { message = "Enterprise profile not found" });

            var enterprise = await _enterpriseRepository.GetEnterpriseByIdAsync(enterpriseDto.Id.ToString(), cancellationToken);
            if (enterprise == null)
                return NotFound(new { message = "Enterprise entity not found" });

            return Ok(new
            {
                success = true,
                message = "Enterprise profile retrieved successfully",
                data = new
                {
                    id = enterprise.Id,
                    companyName = enterprise.CompanyName,
                    serviceArea = enterprise.ServiceArea,
                    capacityKgPerDay = enterprise.CapacityKgPerDay,
                    status = enterprise.Status.ToString(),
                    rejectionReason = enterprise.RejectionReason,
                    createdAt = enterprise.CreatedAt
                }
            });
        }
        catch (Exception ex)
        {
            return StatusCode(500, new { message = "An error occurred", error = ex.Message });
        }
    }

    /// <summary>Update enterprise profile (company name, address, capacity)</summary>
    [HttpPost("profile")]
    [Authorize(Policy = "RequireRole:Enterprise")]
    public async Task<IActionResult> UpdateProfile([FromBody] UpdateEnterpriseProfileCommand cmd)
    {
        if (!ModelState.IsValid)
            return BadRequest(ModelState);

        // Get user ID from JWT token
        var userIdClaim = User.FindFirstValue(ClaimTypes.NameIdentifier) 
                          ?? User.FindFirstValue("sub");

        if (!Guid.TryParse(userIdClaim, out var userId))
            return Unauthorized(new { message = "Invalid user id in token" });

        cmd.UserId = userId;

        try
        {
            await _mediator.Send(cmd);
            return Ok(new { message = "Enterprise profile updated successfully" });
        }
        catch (InvalidOperationException ex)
        {
            return NotFound(new { message = ex.Message });
        }
        catch (Exception ex)
        {
            return StatusCode(500, new { message = "An error occurred", error = ex.Message });
        }
    }
}
