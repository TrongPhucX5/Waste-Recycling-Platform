using MediatR;
using WastePlatform.Application.Admin.Analytics.DTOs;
using WastePlatform.Application.Common.Interfaces;

namespace WastePlatform.Application.Enterprise.Analytics.Queries;

public class GetEnterpriseReportAnalyticsQuery : IRequest<ReportAnalyticsDto>
{
    public DateTime? StartDate { get; set; }
    public DateTime? EndDate { get; set; }
}

public class GetEnterpriseReportAnalyticsQueryHandler : IRequestHandler<GetEnterpriseReportAnalyticsQuery, ReportAnalyticsDto>
{
    private readonly IAnalyticsRepository _analyticsRepository;

    public GetEnterpriseReportAnalyticsQueryHandler(IAnalyticsRepository analyticsRepository)
    {
        _analyticsRepository = analyticsRepository;
    }

    public async Task<ReportAnalyticsDto> Handle(GetEnterpriseReportAnalyticsQuery request, CancellationToken cancellationToken)
    {
        var startDate = request.StartDate ?? DateTime.UtcNow.AddMonths(-1);
        var endDate = request.EndDate ?? DateTime.UtcNow;

        // For enterprise, we need to filter by their service area and accepted waste types
        // This would require additional filtering logic based on enterprise profile
        // For now, return the same analytics but could be extended to filter by enterprise scope
        
        return await _analyticsRepository.GetReportAnalyticsAsync(startDate, endDate, cancellationToken);
    }
}
