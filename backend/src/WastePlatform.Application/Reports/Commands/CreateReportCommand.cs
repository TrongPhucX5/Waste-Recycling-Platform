namespace WastePlatform.Application.Reports.Commands;

public class CreateReportCommand
{
    public int WasteCategoryId { get; set; }
    public decimal Latitude { get; set; }
    public decimal Longitude { get; set; }
    public string? Description { get; set; }
    public string? Address { get; set; }
    public string? AiSuggestion { get; set; }
}
