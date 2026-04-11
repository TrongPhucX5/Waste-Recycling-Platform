using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using MediatR;
using System.Security.Claims;
using WastePlatform.Application.Notifications.Queries;
using WastePlatform.Application.Notifications.Commands;
using WastePlatform.Application.DTOs;

namespace WastePlatform.API.Controllers;

[Authorize]
[ApiController]
[Route("api/[controller]")]
public class NotificationsController : ControllerBase
{
    private readonly IMediator _mediator;

    public NotificationsController(IMediator mediator)
    {
        _mediator = mediator;
    }

    private Guid GetUserId()
    {
        var userIdClaim = User.FindFirst(ClaimTypes.NameIdentifier);
        if (userIdClaim == null || !Guid.TryParse(userIdClaim.Value, out var userId))
        {
            throw new UnauthorizedAccessException("User ID not found in token.");
        }
        return userId;
    }

    [HttpGet]
    public async Task<ActionResult<IEnumerable<NotificationDto>>> GetNotifications([FromQuery] int limit = 50)
    {
        var userId = GetUserId();
        var query = new GetNotificationsQuery(userId, limit);
        var result = await _mediator.Send(query);
        return Ok(result);
    }

    [HttpGet("unread-count")]
    public async Task<ActionResult<int>> GetUnreadCount()
    {
        var userId = GetUserId();
        var query = new GetUnreadCountQuery(userId);
        var result = await _mediator.Send(query);
        return Ok(result);
    }

    [HttpPut("{id}/read")]
    public async Task<IActionResult> MarkAsRead(Guid id)
    {
        var command = new MarkAsReadCommand(id);
        var result = await _mediator.Send(command);
        if (!result) return NotFound();
        return NoContent();
    }

    [HttpPut("read-all")]
    public async Task<IActionResult> MarkAllAsRead()
    {
        var userId = GetUserId();
        var command = new MarkAllAsReadCommand(userId);
        await _mediator.Send(command);
        return NoContent();
    }
}
