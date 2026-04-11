using WastePlatform.Application.Enterprise.Queries;
// Đặt bí danh cho class Enterprise để không bị nhầm lẫn
using DomainEnterprise = WastePlatform.Domain.Entities.Enterprise;

namespace WastePlatform.Application.Common.Interfaces
{
    public interface IEnterpriseRepository
    {
        Task<EnterpriseDto?> GetEnterpriseByUserIdAsync(Guid userId, CancellationToken cancellationToken);
<<<<<<< HEAD
        Task<global::WastePlatform.Domain.Entities.Enterprise?> GetEnterpriseByIdAsync(string enterpriseId, CancellationToken cancellationToken);
        Task<List<global::WastePlatform.Domain.Entities.Enterprise>> GetEnterpriseListAsync(CancellationToken cancellationToken);
            Task<List<global::WastePlatform.Domain.Entities.Enterprise>> GetEnterprisesByWasteCategoryAsync(int wasteCategoryId, CancellationToken cancellationToken);
=======
        Task<DomainEnterprise?> GetEnterpriseByIdAsync(string enterpriseId, CancellationToken cancellationToken);
        Task<List<DomainEnterprise>> GetEnterpriseListAsync(CancellationToken cancellationToken);
        Task UpdateAsync(DomainEnterprise enterprise, CancellationToken cancellationToken);
>>>>>>> e862492f7ee252a8578b1bdad4edd60a72624682
    }
}