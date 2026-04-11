using MediatR;
using WastePlatform.Application.Common.Interfaces;
using WastePlatform.Application.Admin.Complaints.Commands;
using WastePlatform.Application.Notifications.Commands;
using WastePlatform.Domain.Enums;

namespace WastePlatform.Application.Admin.Complaints.Commands.Handlers;

public class ResolveComplaintCommandHandler : IRequestHandler<ResolveComplaintCommand, ResolveComplaintResult>
{
    private readonly IComplaintRepository _complaintRepository;
    private readonly IMediator _mediator;

    public ResolveComplaintCommandHandler(IComplaintRepository complaintRepository, IMediator mediator)
    {
        _complaintRepository = complaintRepository;
        _mediator = mediator;
    }

    public async Task<ResolveComplaintResult> Handle(ResolveComplaintCommand request, CancellationToken cancellationToken)
    {
        var complaint = await _complaintRepository.GetByIdAsync(request.ComplaintId, cancellationToken);

        if (complaint == null)
        {
            return new ResolveComplaintResult
            {
                Success = false,
                Message = "Complaint not found",
                ComplaintId = request.ComplaintId
            };
        }

        complaint.Resolve(request.AdminResponse);

        await _complaintRepository.SaveChangesAsync(cancellationToken);

        // Notify Citizen
        await _mediator.Send(new SendNotificationCommand(
            complaint.CitizenId,
            "Khiếu nại đã được giải quyết",
            $"Khiếu nại của bạn về báo cáo rác đã được xử lý. Phản hồi của hệ thống: {request.AdminResponse}",
            NotificationType.ComplaintStatusUpdated,
            complaint.Id
        ), cancellationToken);

        return new ResolveComplaintResult
        {
            Success = true,
            Message = "Complaint resolved successfully",
            ComplaintId = request.ComplaintId
        };
    }
}
