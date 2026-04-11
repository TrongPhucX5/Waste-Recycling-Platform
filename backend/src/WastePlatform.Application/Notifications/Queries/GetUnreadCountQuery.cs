using MediatR;
using WastePlatform.Application.Common.Interfaces;

namespace WastePlatform.Application.Notifications.Queries;

public record GetUnreadCountQuery(Guid UserId) : IRequest<int>;

public class GetUnreadCountQueryHandler : IRequestHandler<GetUnreadCountQuery, int>
{
    private readonly INotificationRepository _notificationRepository;

    public GetUnreadCountQueryHandler(INotificationRepository notificationRepository)
    {
        _notificationRepository = notificationRepository;
    }

    public async Task<int> Handle(GetUnreadCountQuery request, CancellationToken cancellationToken)
    {
        return await _notificationRepository.GetUnreadCountAsync(request.UserId);
    }
}
