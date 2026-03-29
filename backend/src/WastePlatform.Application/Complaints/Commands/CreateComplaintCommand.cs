using MediatR;
using WastePlatform.Application.Common.DTOs;
using WastePlatform.Application.Common.Interfaces;

namespace WastePlatform.Application.Complaints.Commands;

public class CreateComplaintCommand : IRequest<Guid>
{
    public Guid CitizenId { get; set; }
    public string Content { get; set; } = null!;
    public Guid? ReportId { get; set; }
}

public class CreateComplaintCommandHandler : IRequestHandler<CreateComplaintCommand, Guid>
{
    private readonly IComplaintRepository _complaintRepository;

    public CreateComplaintCommandHandler(IComplaintRepository complaintRepository)
    {
        _complaintRepository = complaintRepository;
    }

    public async Task<Guid> Handle(CreateComplaintCommand request, CancellationToken cancellationToken)
    {
        if (string.IsNullOrWhiteSpace(request.Content))
            throw new ArgumentException("Complaint content cannot be empty", nameof(request.Content));

        var complaint = Domain.Entities.Complaint.Create(
            request.CitizenId,
            request.Content,
            request.ReportId);

        await _complaintRepository.AddAsync(complaint, cancellationToken);
        await _complaintRepository.SaveChangesAsync(cancellationToken);

        return complaint.Id;
    }
}
