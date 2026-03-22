using MediatR;
using Microsoft.EntityFrameworkCore;
using WastePlatform.Infrastructure.Persistence;

namespace WastePlatform.Application.Enterprise.Queries;

public class GetEnterpriseByUserIdQueryHandler : IRequestHandler<GetEnterpriseByUserIdQuery, EnterpriseDto?>
{
    private readonly WastePlatformDbContext _context;

    public GetEnterpriseByUserIdQueryHandler(WastePlatformDbContext context)
    {
        _context = context;
    }

    public async Task<EnterpriseDto?> Handle(GetEnterpriseByUserIdQuery request, CancellationToken cancellationToken)
    {
        var enterprise = await _context.Enterprises
            .AsNoTracking()
            .Where(e => e.UserId == request.UserId)
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
}
