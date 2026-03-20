using Microsoft.EntityFrameworkCore;
using WastePlatform.Application.Common.Interfaces;
using WastePlatform.Domain.Entities;
using WastePlatform.Domain.Enums; // Đảm bảo đã import namespace chứa UserRole

namespace WastePlatform.Infrastructure.Persistence.Repositories
{
    public class UserRepository : IUserRepository
    {
        private readonly WastePlatformDbContext _context;

        public UserRepository(WastePlatformDbContext context)
        {
            _context = context;
        }

        public async Task<List<User>> GetUsersAsync(string? search, string? role, CancellationToken cancellationToken)
        {
            var query = _context.Users.AsQueryable();

            // 1. Logic Search (EF.Functions.Like)
            if (!string.IsNullOrWhiteSpace(search))
            {
                string pattern = $"%{search}%";
                query = query.Where(u => 
                    EF.Functions.Like(u.FullName, pattern) || 
                    EF.Functions.Like(u.Email, pattern));
            }

            // 2. Lọc theo Role (Sửa lỗi CS0019 ở đây)
            if (!string.IsNullOrWhiteSpace(role) && !role.Equals("all", StringComparison.OrdinalIgnoreCase))
            {
                // Cố gắng chuyển string 'role' sang kiểu Enum 'UserRole'
                // Tham số 'true' để bỏ qua phân biệt hoa thường (ví dụ: "admin" hay "Admin" đều được)
                if (Enum.TryParse<UserRole>(role, true, out var roleEnum))
                {
                    // Giờ so sánh Enum với Enum là chuẩn bài!
                    query = query.Where(u => u.Role == roleEnum);
                }
            }

            return await query.ToListAsync(cancellationToken);
        }

        public async Task<int> GetTotalCountAsync(CancellationToken ct)
        {
            return await _context.Users.CountAsync(ct);
        }
    }
}