using MediatR;
using WastePlatform.Application.Common.Interfaces;

namespace WastePlatform.Application.Notifications.Commands;

public record MarkAsReadCommand(Guid NotificationId) : IRequest<bool>;

public class MarkAsReadCommandHandler : IRequestHandler<MarkAsReadCommand, bool>
{
    private readonly INotificationRepository _notificationRepository;

    public MarkAsReadCommandHandler(INotificationRepository notificationRepository)
    {
        _notificationRepository = notificationRepository;
    }

    public async Task<bool> Handle(MarkAsReadCommand request, CancellationToken cancellationToken)
    {
        var notification = await _notificationRepository.GetByIdAsync(request.NotificationId);
        if (notification == null) return false;

        notification.MarkAsRead();
        await _notificationRepository.UpdateAsync(notification);
        return true;
    }
}
