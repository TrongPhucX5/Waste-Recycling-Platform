namespace WastePlatform.Domain.Enums;

public enum UserRole
{
    Citizen = 1,
    Enterprise = 2,
    Collector = 3,
    Admin = 4
}

public enum WasteReportStatus
{
    Pending = 1,
    Accepted = 2,
    Assigned = 3,
    Collected = 4,
    Rejected = 5
}

public enum CollectionTaskStatus
{
    Assigned = 1,
    OnTheWay = 2,
    Collected = 3
}

public enum ComplaintStatus
{
    Open = 1,
    InProgress = 2,
    Resolved = 3,
    Rejected = 4
}
