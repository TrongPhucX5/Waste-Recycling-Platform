namespace WastePlatform.Application.Admin.Dashboard.DTOs
{
    public class DashboardStatsDto
    {
        public int TotalUsers { get; set; }
        public int TotalReports { get; set; }
        public int PendingComplaints { get; set; }
        public double TotalWasteWeight { get; set; } // kg
        
        // Bạn có thể thêm danh sách cho biểu đồ ở đây nếu muốn
        public List<MonthlyReportDto> MonthlyTraffic { get; set; } = new();
    }

    public class MonthlyReportDto
    {
        public string Month { get; set; } = string.Empty;
        public int Count { get; set; }
    }
}