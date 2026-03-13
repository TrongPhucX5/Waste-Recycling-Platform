using WastePlatform.Domain.Enums;

namespace WastePlatform.Domain.Entities;

public class Complaint
{
    public Guid Id { get; private set; }
    public Guid CitizenId { get; private set; }
    public Guid? ReportId { get; private set; }
    public string Content { get; private set; } = null!;
    public ComplaintStatus Status { get; private set; } = ComplaintStatus.Open;
    public string? AdminResponse { get; private set; }
    public DateTime CreatedAt { get; private set; } = DateTime.UtcNow;
    public DateTime? ResolvedAt { get; private set; }

    public User Citizen { get; private set; } = null!;
    public WasteReport? WasteReport { get; private set; }

    protected Complaint() { }

    public static Complaint Create(Guid citizenId, string content, Guid? reportId = null)
        => new() { Id = Guid.NewGuid(), CitizenId = citizenId, Content = content, ReportId = reportId };

    public void Resolve(string adminResponse)
    {
        Status = ComplaintStatus.Resolved;
        AdminResponse = adminResponse;
        ResolvedAt = DateTime.UtcNow;
    }

    public void Reject(string adminResponse)
    {
        Status = ComplaintStatus.Rejected;
        AdminResponse = adminResponse;
        ResolvedAt = DateTime.UtcNow;
    }
}
