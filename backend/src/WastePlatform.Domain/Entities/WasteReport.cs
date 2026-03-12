using WastePlatform.Domain.Enums;

namespace WastePlatform.Domain.Entities;

public class WasteReport
{
    public Guid Id { get; set; }
    public Guid CitizenId { get; set; }
    public int? WasteCategoryId { get; set; }
    public string? Description { get; set; }
    public decimal Latitude { get; set; }
    public decimal Longitude { get; set; }
    public string? Address { get; set; }
    public WasteReportStatus Status { get; set; } = WasteReportStatus.Pending;
    public string? AiSuggestion { get; set; }
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

    // Navigation properties
    public virtual User Citizen { get; set; } = null!;
    public virtual WasteCategory? WasteCategory { get; set; }
    public virtual ICollection<ReportImage> Images { get; set; } = new List<ReportImage>();
    public virtual CollectionTask? CollectionTask { get; set; }
    public virtual ICollection<Complaint> Complaints { get; set; } = new List<Complaint>();
    public virtual ICollection<RewardPoints> RewardPoints { get; set; } = new List<RewardPoints>();
}
