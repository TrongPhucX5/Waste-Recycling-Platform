using Microsoft.EntityFrameworkCore;
using WastePlatform.Application.Common.Interfaces;
using WastePlatform.Domain.Entities;
using WastePlatform.Domain.Enums;
using WastePlatform.Infrastructure.Persistence;

namespace WastePlatform.Infrastructure.Persistence.Repositories;

public class ReportRepository : IReportRepository
{
    private readonly WastePlatformDbContext _context;

    public ReportRepository(WastePlatformDbContext context)
    {
        _context = context;
    }

    public async Task<WasteReport> AddAsync(WasteReport report, CancellationToken cancellationToken = default)
    {
        await _context.WasteReports.AddAsync(report, cancellationToken);
        return report;
    }

    public async Task<WasteReport?> GetByIdAsync(Guid id, CancellationToken cancellationToken = default)
    {
        return await _context.WasteReports
            .Include(r => r.Citizen)
            .Include(r => r.WasteCategory)
            .Include(r => r.Images)
            .Include(r => r.RewardPoints)
            .FirstOrDefaultAsync(r => r.Id == id, cancellationToken);
    }

    public async Task<(IEnumerable<WasteReport> Reports, int Total)> GetByCitizenIdAsync(Guid citizenId, int page, int pageSize, CancellationToken cancellationToken = default)
    {
        var query = _context.WasteReports
            .Where(r => r.CitizenId == citizenId)
            .Include(r => r.Citizen)
            .Include(r => r.WasteCategory)
            .Include(r => r.Images);

        var total = await query.CountAsync(cancellationToken);
        
        var reports = await query
            .OrderByDescending(r => r.CreatedAt)
            .Skip((page - 1) * pageSize)
            .Take(pageSize)
            .ToListAsync(cancellationToken);

        return (reports, total);
    }

    public async Task<(IEnumerable<WasteReport> Reports, int Total)> GetAllAsync(int page, int pageSize, ReportStatus? status, CancellationToken cancellationToken = default)
    {
        var query = _context.WasteReports
            .Include(r => r.Citizen)
            .Include(r => r.WasteCategory)
            .Include(r => r.Images)
            .AsQueryable();

        if (status.HasValue)
        {
            query = query.Where(r => r.Status == status.Value);
        }

        var total = await query.CountAsync(cancellationToken);

        var reports = await query
            .OrderByDescending(r => r.CreatedAt)
            .Skip((page - 1) * pageSize)
            .Take(pageSize)
            .ToListAsync(cancellationToken);

        return (reports, total);
    }

    public async Task SaveChangesAsync(CancellationToken cancellationToken = default)
    {
        await _context.SaveChangesAsync(cancellationToken);
    }
}
