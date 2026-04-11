using MediatR;
using WastePlatform.Application.Common.Interfaces;
using WastePlatform.Application.DTOs;

namespace WastePlatform.Application.Notifications.Queries;

public record GetNotificationsQuery(Guid UserId, int Limit = 50) : IRequest<IEnumerable<NotificationDto>>;

public class GetNotificationsQueryHandler : IRequestHandler<GetNotificationsQuery, IEnumerable<NotificationDto>>
{
    private readonly INotificationRepository _notificationRepository;

    public GetNotificationsQueryHandler(INotificationRepository notificationRepository)
    {
        _notificationRepository = notificationRepository;
    }

    public async Task<IEnumerable<NotificationDto>> Handle(GetNotificationsQuery request, CancellationToken cancellationToken)
    {
        var notifications = await _notificationRepository.GetByUserIdAsync(request.UserId, request.Limit);
        
        return notifications.Select(n => new NotificationDto
        {
            Id = n.Id,
            Title = n.Title,
            Message = n.Message,
            Type = n.Type,
            RelatedEntityId = n.RelatedEntityId,
            IsRead = n.IsRead,
            CreatedAt = n.CreatedAt
        });
    }
}
