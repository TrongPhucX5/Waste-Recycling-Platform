using Microsoft.EntityFrameworkCore;
using WastePlatform.Application.Admin.Dashboard.DTOs;
using WastePlatform.Application.Common.Interfaces;

namespace WastePlatform.Infrastructure.Persistence.Repositories
{
    public class DashboardRepository : IDashboardRepository
    {
        private readonly WastePlatformDbContext _context;

        public DashboardRepository(WastePlatformDbContext context)
        {
            _context = context;
        }

        public async Task<DashboardStatsDto> GetStatsAsync(CancellationToken ct)
        {
            // Count the actual number of Users in the Database
            var totalUsers = await _context.Users.CountAsync(ct);

            return new DashboardStatsDto
            {
                TotalUsers = totalUsers,
                
                // TODO: If you have created Entities for Reports and Complaints, replace 0 with the counting code like the lines below:
                // TotalReports = await _context.Reports.CountAsync(ct),
                // PendingComplaints = await _context.Complaints.CountAsync(c => c.Status == "Pending", ct),
                TotalReports = 0, 
                PendingComplaints = 0, 
                TotalWasteWeight = 5600 // Simulated kg of waste
            };
        }
    }
}