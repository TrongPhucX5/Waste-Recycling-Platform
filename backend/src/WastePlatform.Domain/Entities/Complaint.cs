using WastePlatform.Domain.Enums;

namespace WastePlatform.Domain.Entities;

public class Complaint
{
    public Guid Id { get; set; }
    public Guid CitizenId { get; set; }
    public Guid? ReportId { get; set; }
    public string Content { get; set; } = null!;
    public ComplaintStatus Status { get; set; } = ComplaintStatus.Open;
    public string? AdminResponse { get; set; }
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    public DateTime? ResolvedAt { get; set; }

    // Navigation properties
    public virtual User Citizen { get; set; } = null!;
    public virtual WasteReport? WasteReport { get; set; }
}
