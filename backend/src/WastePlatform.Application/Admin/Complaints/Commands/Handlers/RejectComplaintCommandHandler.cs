using MediatR;
using WastePlatform.Application.Common.Interfaces;
using WastePlatform.Application.Admin.Complaints.Commands;
using WastePlatform.Application.Notifications.Commands;
using WastePlatform.Domain.Enums;

namespace WastePlatform.Application.Admin.Complaints.Commands.Handlers;

public class RejectComplaintCommandHandler : IRequestHandler<RejectComplaintCommand, RejectComplaintResult>
{
    private readonly IComplaintRepository _complaintRepository;
    private readonly IMediator _mediator;

    public RejectComplaintCommandHandler(IComplaintRepository complaintRepository, IMediator mediator)
    {
        _complaintRepository = complaintRepository;
        _mediator = mediator;
    }

    public async Task<RejectComplaintResult> Handle(RejectComplaintCommand request, CancellationToken cancellationToken)
    {
        var complaint = await _complaintRepository.GetByIdAsync(request.ComplaintId, cancellationToken);

        if (complaint == null)
        {
            return new RejectComplaintResult
            {
                Success = false,
                Message = "Complaint not found",
                ComplaintId = request.ComplaintId
            };
        }

        complaint.Reject(request.AdminResponse);

        await _complaintRepository.SaveChangesAsync(cancellationToken);

        // Notify Citizen
        await _mediator.Send(new SendNotificationCommand(
            complaint.CitizenId,
            "Khiếu nại bị từ chối",
            $"Khiếu nại của bạn về báo cáo rác đã bị từ chối. Lý do: {request.AdminResponse}",
            NotificationType.ComplaintStatusUpdated,
            complaint.Id
        ), cancellationToken);

        return new RejectComplaintResult
        {
            Success = true,
            Message = "Complaint rejected successfully",
            ComplaintId = request.ComplaintId
        };
    }
}
