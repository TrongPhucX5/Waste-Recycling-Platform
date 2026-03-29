using WastePlatform.Domain.Enums;

namespace WastePlatform.Application.Common.DTOs;

/// <summary>DTO for creating a new complaint</summary>
public class CreateComplaintDto
{
    public string Content { get; set; } = null!;
    public Guid? ReportId { get; set; }
}

/// <summary>DTO for complaint details - used by admin and citizen</summary>
public class ComplaintDto
{
    public Guid Id { get; set; }
    public Guid CitizenId { get; set; }
    public string? CitizenName { get; set; }
    public Guid? ReportId { get; set; }
    public string Content { get; set; } = null!;
    public ComplaintStatus Status { get; set; }
    public string? AdminResponse { get; set; }
    public DateTime CreatedAt { get; set; }
    public DateTime? ResolvedAt { get; set; }
}

/// <summary>DTO for complaint list (simplified view)</summary>
public class ComplaintListDto
{
    public Guid Id { get; set; }
    public Guid? ReportId { get; set; }
    public string Content { get; set; } = null!;
    public ComplaintStatus Status { get; set; }
    public DateTime CreatedAt { get; set; }
    public string? AdminResponse { get; set; }
}

/// <summary>DTO for paginated complaints response</summary>
public class ComplaintsResponseDto
{
    public IEnumerable<ComplaintListDto> Items { get; set; } = new List<ComplaintListDto>();
    public int Page { get; set; }
    public int PageSize { get; set; }
    public int Total { get; set; }
}
