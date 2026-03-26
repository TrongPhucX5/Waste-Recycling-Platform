using WastePlatform.Application.Enterprise.Queries;
using WastePlatform.Domain.Entities;

namespace WastePlatform.Application.Common.Interfaces
{
    public interface IEnterpriseRepository
    {
        Task<EnterpriseDto?> GetEnterpriseByUserIdAsync(Guid userId, CancellationToken cancellationToken);
        Task<global::WastePlatform.Domain.Entities.Enterprise?> GetEnterpriseByIdAsync(string enterpriseId, CancellationToken cancellationToken);
        Task<List<global::WastePlatform.Domain.Entities.Enterprise>> GetEnterpriseListAsync(CancellationToken cancellationToken);
    }
}
