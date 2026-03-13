using WastePlatform.Domain.Enums;

namespace WastePlatform.Application.Auth.Commands;

public class RegisterCommand
{
    public string Email { get; set; } = null!;
    public string Password { get; set; } = null!;
    public string FullName { get; set; } = null!;
}
