using WastePlatform.Domain.Enums;

namespace WastePlatform.Application.Auth;

public class AuthResponse
{
    public string Token { get; set; } = null!;
    public DateTime ExpiresAt { get; set; }
    public Guid UserId { get; set; }
    public string FullName { get; set; } = null!;
    public string Email { get; set; } = null!;
    public string Role { get; set; } = null!;
}
