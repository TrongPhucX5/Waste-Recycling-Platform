using Microsoft.EntityFrameworkCore;
using WastePlatform.Application.Admin.Analytics.DTOs;
using WastePlatform.Application.Common.Interfaces;
using WastePlatform.Domain.Enums;
using WastePlatform.Infrastructure.Persistence;

namespace WastePlatform.Infrastructure.Persistence.Repositories;

public class AnalyticsRepository : IAnalyticsRepository
{
    private readonly WastePlatformDbContext _context;

    public AnalyticsRepository(WastePlatformDbContext context)
    {
        _context = context;
    }

    public async Task<AnalyticsOverviewDto> GetOverviewAsync(CancellationToken cancellationToken = default)
    {
        var totalReports = await _context.WasteReports.CountAsync(cancellationToken);
        var totalComplaints = await _context.Complaints.CountAsync(cancellationToken);
        var totalUsers = await _context.Users.CountAsync(cancellationToken);
        var activeEnterprises = await _context.Enterprises.CountAsync(e => e.IsVerified, cancellationToken);
        var registeredCollectors = await _context.Users.CountAsync(u => u.Role == UserRole.Collector, cancellationToken);

        return new AnalyticsOverviewDto
        {
            TotalReports = totalReports,
            TotalComplaints = totalComplaints,
            TotalUsers = totalUsers,
            ActiveEnterprises = activeEnterprises,
            RegisteredCollectors = registeredCollectors,
            TotalWasteCollected = 0m // Will be calculated from actual data
        };
    }

    public async Task<ReportAnalyticsDto> GetReportAnalyticsAsync(DateTime startDate, DateTime endDate, CancellationToken cancellationToken = default)
    {
        var reports = await _context.WasteReports
            .Where(r => r.CreatedAt >= startDate && r.CreatedAt <= endDate)
            .Include(r => r.WasteCategory)
            .ToListAsync(cancellationToken);

        var totalReports = reports.Count;
        var acceptedReports = reports.Count(r => r.Status == ReportStatus.Accepted);
        var pendingReports = reports.Count(r => r.Status == ReportStatus.Pending);
        var rejectedReports = reports.Count(r => r.Status == ReportStatus.Rejected);
        var collectedReports = reports.Count(r => r.Status == ReportStatus.Collected);

        var reportsByCategory = reports
            .GroupBy(r => r.WasteCategory?.Name ?? "Unknown")
            .ToDictionary(g => g.Key, g => g.Count());

        var dayCount = (endDate - startDate).Days + 1;
        var averageReportsPerDay = dayCount > 0 ? (decimal)totalReports / dayCount : 0;

        return new ReportAnalyticsDto
        {
            TotalReports = totalReports,
            AcceptedReports = acceptedReports,
            PendingReports = pendingReports,
            RejectedReports = rejectedReports,
            CollectedReports = collectedReports,
            ReportsByCategory = reportsByCategory,
            AverageReportsPerDay = averageReportsPerDay
        };
    }

    public async Task<UserAnalyticsDto> GetUserAnalyticsAsync(CancellationToken cancellationToken = default)
    {
        var citizens = await _context.Users
            .Where(u => u.Role == UserRole.Citizen)
            .ToListAsync(cancellationToken);

        var enterprises = await _context.Enterprises.ToListAsync(cancellationToken);
        var collectors = await _context.Users
            .Where(u => u.Role == UserRole.Collector)
            .ToListAsync(cancellationToken);

        var admins = await _context.Users
            .Where(u => u.Role == UserRole.Admin)
            .ToListAsync(cancellationToken);

        return new UserAnalyticsDto
        {
            TotalCitizens = citizens.Count,
            ActiveCitizens = citizens.Count(c => c.IsActive),
            InactiveCitizens = citizens.Count(c => !c.IsActive),
            TotalEnterprises = enterprises.Count,
            VerifiedEnterprises = enterprises.Count(e => e.IsVerified),
            UnverifiedEnterprises = enterprises.Count(e => !e.IsVerified),
            TotalCollectors = collectors.Count,
            ActiveCollectors = collectors.Count(c => c.IsActive),
            TotalAdmins = admins.Count
        };
    }

    public async Task<WasteAnalyticsDto> GetWasteAnalyticsAsync(DateTime startDate, DateTime endDate, CancellationToken cancellationToken = default)
    {
        var categories = await _context.WasteCategories.ToListAsync(cancellationToken);
        var reports = await _context.WasteReports
            .Where(r => r.CreatedAt >= startDate && r.CreatedAt <= endDate)
            .Include(r => r.WasteCategory)
            .ToListAsync(cancellationToken);

        var wasteByCategory = reports
            .GroupBy(r => r.WasteCategory?.Name ?? "Unknown")
            .ToDictionary(g => g.Key, g => (decimal)g.Count());

        var totalWasteKg = wasteByCategory.Values.Sum();

        var wasteByMonth = reports
            .GroupBy(r => r.CreatedAt.ToString("yyyy-MM"))
            .ToDictionary(g => g.Key, g => (decimal)g.Count());

        var averageWastePerReport = reports.Any() ? totalWasteKg / reports.Count : 0;

        return new WasteAnalyticsDto
        {
            TotalWasteCategories = categories.Count,
            WasteByCategory = wasteByCategory,
            TotalWasteKg = totalWasteKg,
            WasteByMonth = wasteByMonth,
            AverageWastePerReport = averageWastePerReport,
            ActiveWasteTypes = categories.Count
        };
    }

    public async Task<AnalyticsSummaryDto> GetSummaryAsync(DateTime startDate, DateTime endDate, CancellationToken cancellationToken = default)
    {
        return new AnalyticsSummaryDto
        {
            Overview = await GetOverviewAsync(cancellationToken),
            ReportAnalytics = await GetReportAnalyticsAsync(startDate, endDate, cancellationToken),
            UserAnalytics = await GetUserAnalyticsAsync(cancellationToken),
            WasteAnalytics = await GetWasteAnalyticsAsync(startDate, endDate, cancellationToken)
        };
    }
}
