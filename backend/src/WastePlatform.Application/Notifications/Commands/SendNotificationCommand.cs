using MediatR;
using WastePlatform.Application.Common.Interfaces;
using WastePlatform.Application.DTOs;
using WastePlatform.Domain.Entities;
using WastePlatform.Domain.Enums;

namespace WastePlatform.Application.Notifications.Commands;

public record SendNotificationCommand(
    Guid UserId, 
    string Title, 
    string Message, 
    NotificationType Type, 
    Guid? RelatedEntityId = null
) : IRequest<Guid>;

public class SendNotificationCommandHandler : IRequestHandler<SendNotificationCommand, Guid>
{
    private readonly INotificationRepository _notificationRepository;
    private readonly INotificationRealTimeService _realTimeService;

    public SendNotificationCommandHandler(
        INotificationRepository notificationRepository,
        INotificationRealTimeService realTimeService)
    {
        _notificationRepository = notificationRepository;
        _realTimeService = realTimeService;
    }

    public async Task<Guid> Handle(SendNotificationCommand request, CancellationToken cancellationToken)
    {
        var notification = Notification.Create(
            request.UserId,
            request.Title,
            request.Message,
            request.Type,
            request.RelatedEntityId
        );

        await _notificationRepository.AddAsync(notification);

        // Map to DTO for SignalR
        var notificationDto = new NotificationDto
        {
            Id = notification.Id,
            Title = notification.Title,
            Message = notification.Message,
            Type = notification.Type,
            RelatedEntityId = notification.RelatedEntityId,
            IsRead = notification.IsRead,
            CreatedAt = notification.CreatedAt
        };

        // Send real-time notification
        await _realTimeService.SendNotificationToUserAsync(request.UserId, notificationDto);

        return notification.Id;
    }
}
