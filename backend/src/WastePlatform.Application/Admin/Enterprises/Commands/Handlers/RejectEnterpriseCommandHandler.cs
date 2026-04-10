using MediatR;
using WastePlatform.Application.Common.Interfaces;
using WastePlatform.Application.Admin.Enterprises.Commands;
using WastePlatform.Domain.Enums;

namespace WastePlatform.Application.Admin.Enterprises.Commands.Handlers;

public class RejectEnterpriseCommandHandler : IRequestHandler<RejectEnterpriseCommand, RejectEnterpriseResult>
{
    private readonly IEnterpriseRepository _enterpriseRepository;

    public RejectEnterpriseCommandHandler(IEnterpriseRepository enterpriseRepository)
    {
        _enterpriseRepository = enterpriseRepository;
    }

    public async Task<RejectEnterpriseResult> Handle(RejectEnterpriseCommand request, CancellationToken cancellationToken)
    {
        var enterprise = await _enterpriseRepository.GetEnterpriseByIdAsync(request.EnterpriseId.ToString(), cancellationToken);

        if (enterprise == null)
        {
            return new RejectEnterpriseResult
            {
                Success = false,
                Message = "Enterprise not found",
                EnterpriseId = request.EnterpriseId
            };
        }

        // Mark enterprise as rejected and store rejection reason
        enterprise.Status = EnterpriseStatus.Rejected;
        enterprise.IsVerified = false;
        enterprise.RejectionReason = request.ReasonForRejection;

        // Save changes to database
        await _enterpriseRepository.UpdateAsync(enterprise, cancellationToken);

        return new RejectEnterpriseResult
        {
            Success = true,
            Message = "Enterprise rejected successfully",
            EnterpriseId = request.EnterpriseId
        };
    }
}
