using MediatR;
using WastePlatform.Application.Common.Interfaces;

namespace WastePlatform.Application.Enterprise.Commands;

public class UpdateEnterpriseProfileCommand : IRequest
{
    public Guid UserId { get; set; }
    public string CompanyName { get; set; } = null!;
    public string? Address { get; set; }
    public string? PhoneNumber { get; set; }
    public string? ServiceArea { get; set; }
    public int? CapacityKgPerDay { get; set; }
}

public class UpdateEnterpriseProfileCommandHandler : IRequestHandler<UpdateEnterpriseProfileCommand>
{
    private readonly IEnterpriseRepository _enterpriseRepository;

    public UpdateEnterpriseProfileCommandHandler(IEnterpriseRepository enterpriseRepository)
    {
        _enterpriseRepository = enterpriseRepository;
    }

    public async Task Handle(UpdateEnterpriseProfileCommand request, CancellationToken cancellationToken)
    {
        var enterpriseDto = await _enterpriseRepository.GetEnterpriseByUserIdAsync(request.UserId, cancellationToken)
            ?? throw new InvalidOperationException("Enterprise profile not found");

        var enterprise = await _enterpriseRepository.GetEnterpriseByIdAsync(enterpriseDto.Id.ToString(), cancellationToken)
            ?? throw new InvalidOperationException("Enterprise entity not found");

        // ĐÃ THÊM Address VÀ PhoneNumber VÀO ĐÂY ĐỂ KHÔNG BỊ MẤT DỮ LIỆU
        enterprise.CompanyName = request.CompanyName;
        enterprise.Address = request.Address;
        enterprise.PhoneNumber = request.PhoneNumber;
        enterprise.ServiceArea = request.ServiceArea;
        enterprise.CapacityKgPerDay = request.CapacityKgPerDay;

        await _enterpriseRepository.UpdateAsync(enterprise, cancellationToken);
    }
}