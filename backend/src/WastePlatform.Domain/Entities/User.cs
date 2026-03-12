using WastePlatform.Domain.Enums;

namespace WastePlatform.Domain.Entities;

public class User
{
    public Guid Id { get; set; }
    public string Email { get; set; } = null!;
    public string PasswordHash { get; set; } = null!;
    public string FullName { get; set; } = null!;
    public string? Phone { get; set; }
    public UserRole Role { get; set; }
    public string? District { get; set; }
    public string? Ward { get; set; }
    public bool IsActive { get; set; } = true;
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

    // Navigation properties
    public virtual Enterprise? Enterprise { get; set; }
    public virtual Collector? Collector { get; set; }
    public virtual ICollection<WasteReport> WasteReports { get; set; } = new List<WasteReport>();
    public virtual ICollection<Complaint> Complaints { get; set; } = new List<Complaint>();
    public virtual ICollection<RewardPoints> RewardPoints { get; set; } = new List<RewardPoints>();
    public virtual ICollection<AuditLog> AuditLogs { get; set; } = new List<AuditLog>();
}
