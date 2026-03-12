using WastePlatform.Domain.Enums;

namespace WastePlatform.Domain.Entities;

public class CollectionTask
{
    public Guid Id { get; set; }
    public Guid ReportId { get; set; }
    public Guid EnterpriseId { get; set; }
    public Guid? CollectorId { get; set; }
    public CollectionTaskStatus Status { get; set; } = CollectionTaskStatus.Assigned;
    public decimal? CollectedWeightKg { get; set; }
    public string? Notes { get; set; }
    public DateTime AssignedAt { get; set; } = DateTime.UtcNow;
    public DateTime? CompletedAt { get; set; }

    // Navigation properties
    public virtual WasteReport WasteReport { get; set; } = null!;
    public virtual Enterprise Enterprise { get; set; } = null!;
    public virtual Collector? Collector { get; set; }
    public virtual ICollection<TaskStatusLog> StatusLogs { get; set; } = new List<TaskStatusLog>();
    public virtual ICollection<CollectionImage> Images { get; set; } = new List<CollectionImage>();
}
