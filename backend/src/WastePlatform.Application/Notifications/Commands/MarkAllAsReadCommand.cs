using MediatR;
using WastePlatform.Application.Common.Interfaces;

namespace WastePlatform.Application.Notifications.Commands;

public record MarkAllAsReadCommand(Guid UserId) : IRequest<Unit>;

public class MarkAllAsReadCommandHandler : IRequestHandler<MarkAllAsReadCommand, Unit>
{
    private readonly INotificationRepository _notificationRepository;

    public MarkAllAsReadCommandHandler(INotificationRepository notificationRepository)
    {
        _notificationRepository = notificationRepository;
    }

    public async Task<Unit> Handle(MarkAllAsReadCommand request, CancellationToken cancellationToken)
    {
        await _notificationRepository.MarkAllAsReadAsync(request.UserId);
        return Unit.Value;
    }
}
