using WastePlatform.Domain.Entities;

namespace WastePlatform.Application.Common.Interfaces;

public interface INotificationRepository
{
    Task<Notification?> GetByIdAsync(Guid id);
    Task<IEnumerable<Notification>> GetByUserIdAsync(Guid userId, int limit = 50);
    Task<int> GetUnreadCountAsync(Guid userId);
    Task AddAsync(Notification notification);
    Task UpdateAsync(Notification notification);
    Task MarkAllAsReadAsync(Guid userId);
}
