using Microsoft.EntityFrameworkCore;
using WastePlatform.Application.Common.Interfaces;
using WastePlatform.Application.Enterprise.Queries;

namespace WastePlatform.Infrastructure.Persistence.Repositories
{
    public class EnterpriseRepository : IEnterpriseRepository
    {
        private readonly WastePlatformDbContext _context;

        public EnterpriseRepository(WastePlatformDbContext context)
        {
            _context = context;
        }

        public async Task<EnterpriseDto?> GetEnterpriseByUserIdAsync(Guid userId, CancellationToken cancellationToken)
        {
            var enterprise = await _context.Enterprises
                .AsNoTracking()
                .Where(e => e.UserId == userId)
                .Select(e => new EnterpriseDto
                {
                    Id = e.Id,
                    UserId = e.UserId,
                    CompanyName = e.CompanyName,
                    IsVerified = e.IsVerified,
                    CreatedAt = e.CreatedAt
                })
                .FirstOrDefaultAsync(cancellationToken);

            return enterprise;
        }

        public async Task<Domain.Entities.Enterprise?> GetEnterpriseByIdAsync(string enterpriseId, CancellationToken cancellationToken)
        {
            return await _context.Enterprises
                .AsNoTracking()
                .FirstOrDefaultAsync(e => e.Id.ToString() == enterpriseId, cancellationToken);
        }

        public async Task<List<Domain.Entities.Enterprise>> GetEnterpriseListAsync(CancellationToken cancellationToken)
        {
            return await _context.Enterprises
                .AsNoTracking()
                .ToListAsync(cancellationToken);
        }

<<<<<<< HEAD
        public async Task<List<Domain.Entities.Enterprise>> GetEnterprisesByWasteCategoryAsync(int wasteCategoryId, CancellationToken cancellationToken)
        {
            return await _context.Enterprises
                .AsNoTracking()
                .Include(e => e.WasteTypes)
                .Where(e => e.WasteTypes.Any(wt => wt.WasteCategoryId == wasteCategoryId))
                .ToListAsync(cancellationToken);
=======
        public async Task UpdateAsync(Domain.Entities.Enterprise enterprise, CancellationToken cancellationToken)
        {
            _context.Enterprises.Update(enterprise);
            await _context.SaveChangesAsync(cancellationToken);
>>>>>>> e862492f7ee252a8578b1bdad4edd60a72624682
        }
    }
}
