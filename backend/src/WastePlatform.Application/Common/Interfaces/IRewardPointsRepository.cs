using WastePlatform.Domain.Entities;

namespace WastePlatform.Application.Common.Interfaces;

public interface IRewardPointsRepository
{
    Task<RewardPoints> AddAsync(RewardPoints rewardPoints, CancellationToken cancellationToken = default);
    Task<(IEnumerable<RewardPoints> Points, int Total)> GetByCitizenIdAsync(Guid citizenId, int page, int pageSize, CancellationToken cancellationToken = default);
    Task<int> GetTotalPointsByCitizenIdAsync(Guid citizenId, CancellationToken cancellationToken = default);
    Task<(IEnumerable<(Guid CitizenId, string CitizenName, int TotalPoints, int ReportCount)>, int Total)> GetLeaderboardAsync(int page, int pageSize, CancellationToken cancellationToken = default);
    Task SaveChangesAsync(CancellationToken cancellationToken = default);
}
