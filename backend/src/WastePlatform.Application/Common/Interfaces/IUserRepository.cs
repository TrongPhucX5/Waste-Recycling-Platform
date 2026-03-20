using WastePlatform.Domain.Entities;

namespace WastePlatform.Application.Common.Interfaces
{
    public interface IUserRepository
    {
        // Lấy danh sách user với search và filter
        Task<List<User>> GetUsersAsync(string? search, string? role, CancellationToken cancellationToken);

        // Đếm tổng số user
        Task<int> GetTotalCountAsync(CancellationToken ct);
    }
}