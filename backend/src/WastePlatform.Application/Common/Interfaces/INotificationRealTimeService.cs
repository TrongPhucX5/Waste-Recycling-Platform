using WastePlatform.Application.DTOs;

namespace WastePlatform.Application.Common.Interfaces;

public interface INotificationRealTimeService
{
    Task SendNotificationToUserAsync(Guid userId, NotificationDto notification);
}
