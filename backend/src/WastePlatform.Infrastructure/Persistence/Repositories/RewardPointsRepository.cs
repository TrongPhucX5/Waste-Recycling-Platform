using Microsoft.EntityFrameworkCore;
using WastePlatform.Application.Common.Interfaces;
using WastePlatform.Domain.Entities;
using WastePlatform.Domain.Enums; // Thêm dòng này để gọi Enum Role
using WastePlatform.Infrastructure.Persistence;

namespace WastePlatform.Infrastructure.Persistence.Repositories;

public class RewardPointsRepository : IRewardPointsRepository
{
    private readonly WastePlatformDbContext _context;

    public RewardPointsRepository(WastePlatformDbContext context)
    {
        _context = context;
    }

    public async Task<RewardPoints> AddAsync(RewardPoints rewardPoints, CancellationToken cancellationToken = default)
    {
        await _context.RewardPoints.AddAsync(rewardPoints, cancellationToken);
        return rewardPoints;
    }

    public async Task<(IEnumerable<RewardPoints> Points, int Total)> GetByCitizenIdAsync(Guid citizenId, int page, int pageSize, CancellationToken cancellationToken = default)
    {
        var query = _context.RewardPoints
            .Where(rp => rp.CitizenId == citizenId)
            .Include(rp => rp.WasteReport);

        var total = await query.CountAsync(cancellationToken);

        var points = await query
            .OrderByDescending(rp => rp.CreatedAt)
            .Skip((page - 1) * pageSize)
            .Take(pageSize)
            .ToListAsync(cancellationToken);

        return (points, total);
    }

    public async Task<int> GetTotalPointsByCitizenIdAsync(Guid citizenId, CancellationToken cancellationToken = default)
    {
        return await _context.RewardPoints
            .Where(rp => rp.CitizenId == citizenId)
            .SumAsync(rp => rp.Points, cancellationToken);
    }

    public async Task<(IEnumerable<(Guid CitizenId, string CitizenName, int TotalPoints, int ReportCount)>, int Total)> GetLeaderboardAsync(int page, int pageSize, CancellationToken cancellationToken = default)
    {
        // HƯỚNG 2: Bắt đầu từ bảng Users, lấy tất cả những người là Citizen
        var leaderboardQuery = _context.Users
            // Lọc ra các user có quyền là người dân
            .Where(u => u.Role.ToString() == "Citizen")
            .Select(u => new
            {
                CitizenId = u.Id,
                CitizenName = u.FullName,
                
                // Tính tổng điểm từ bảng RewardPoints (nếu null thì gán = 0)
                TotalPoints = _context.RewardPoints
                                .Where(rp => rp.CitizenId == u.Id)
                                .Sum(rp => (int?)rp.Points) ?? 0,
                
                // Đếm số lần có ghi nhận báo cáo (ReportId khác null)
                ReportCount = _context.RewardPoints
                                .Count(rp => rp.CitizenId == u.Id && rp.ReportId != null)
            })
            // Sắp xếp: Ưu tiên Tổng Điểm cao nhất -> Nếu bằng điểm thì ai Báo cáo nhiều hơn sẽ xếp trên
            .OrderByDescending(x => x.TotalPoints)
            .ThenByDescending(x => x.ReportCount);

        var total = await leaderboardQuery.CountAsync(cancellationToken);

        var leaderboard = await leaderboardQuery
            .Skip((page - 1) * pageSize)
            .Take(pageSize)
            .ToListAsync(cancellationToken);

        // Convert anonymous objects to tuples
        var result = leaderboard
            .Select(x => (x.CitizenId, x.CitizenName, x.TotalPoints, x.ReportCount))
            .ToList();

        return (result, total);
    }

    public async Task SaveChangesAsync(CancellationToken cancellationToken = default)
    {
        await _context.SaveChangesAsync(cancellationToken);
    }
}