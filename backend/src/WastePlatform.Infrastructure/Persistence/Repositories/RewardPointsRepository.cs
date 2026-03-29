using Microsoft.EntityFrameworkCore;
using WastePlatform.Application.Common.Interfaces;
using WastePlatform.Domain.Entities;
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
        // Group reward points by citizen and calculate totals
        var leaderboardQuery = _context.RewardPoints
            .Include(rp => rp.Citizen)
            .GroupBy(rp => rp.CitizenId)
            .Select(g => new
            {
                CitizenId = g.Key,
                CitizenName = g.FirstOrDefault()!.Citizen.FullName,
                TotalPoints = g.Sum(rp => rp.Points),
                ReportCount = g.Count(rp => rp.ReportId.HasValue) // Count distinct reports
            })
            .OrderByDescending(x => x.TotalPoints);

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
