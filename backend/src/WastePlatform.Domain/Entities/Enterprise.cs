namespace WastePlatform.Domain.Entities;
using WastePlatform.Domain.Enums;

public class Enterprise
{
    public Guid Id { get; set; }
    public Guid UserId { get; set; }
    public string CompanyName { get; set; } = null!;
    public string? ServiceArea { get; set; } // JSON stored as string
    public int? CapacityKgPerDay { get; set; }
    public EnterpriseStatus Status { get; set; } = EnterpriseStatus.Pending;
    public string? RejectionReason { get; set; }
    public bool IsVerified { get; set; } = false; // Keep for backward compatibility
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

    public string? Address { get; set; }
    public string? PhoneNumber { get; set; }

    // Navigation properties
    public virtual User User { get; set; } = null!;
    public virtual ICollection<Collector> Collectors { get; set; } = new List<Collector>();
    public virtual ICollection<EnterpriseWasteType> WasteTypes { get; set; } = new List<EnterpriseWasteType>();
    public virtual ICollection<CollectionTask> CollectionTasks { get; set; } = new List<CollectionTask>();
    public virtual ICollection<RewardRule> RewardRules { get; set; } = new List<RewardRule>();
}
