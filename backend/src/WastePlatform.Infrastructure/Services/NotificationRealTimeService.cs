using Microsoft.AspNetCore.SignalR;
using WastePlatform.Infrastructure.Hubs;
using WastePlatform.Application.Common.Interfaces;
using WastePlatform.Application.DTOs;

namespace WastePlatform.Infrastructure.Services;

public class NotificationRealTimeService : INotificationRealTimeService
{
    private readonly IHubContext<NotificationHub> _hubContext;

    public NotificationRealTimeService(IHubContext<NotificationHub> hubContext)
    {
        _hubContext = hubContext;
    }

    public async Task SendNotificationToUserAsync(Guid userId, NotificationDto notification)
    {
        // Send to the user's specific group
        await _hubContext.Clients.Group($"User_{userId}")
            .SendAsync("ReceiveNotification", notification);
    }
}
