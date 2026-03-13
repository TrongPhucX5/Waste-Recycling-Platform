using Microsoft.EntityFrameworkCore;
using WastePlatform.Application.Auth;
using WastePlatform.Application.Auth.Commands;
using WastePlatform.Application.Common.Interfaces;
using WastePlatform.Domain.Entities;
using WastePlatform.Domain.Enums;
using WastePlatform.Infrastructure.Persistence;

namespace WastePlatform.Infrastructure.Services;

public class AuthService
{
    private readonly WastePlatformDbContext _db;
    private readonly IJwtService _jwtService;

    public AuthService(WastePlatformDbContext db, IJwtService jwtService)
    {
        _db = db;
        _jwtService = jwtService;
    }

    // ── Register ────────────────────────────────────────────────────────
    // ⚠️ Public registration - always creates Citizen account
    public async Task<AuthResponse> RegisterAsync(RegisterCommand cmd)
    {
        if (await _db.Users.AnyAsync(u => u.Email == cmd.Email.ToLower()))
            throw new InvalidOperationException("Email đã được sử dụng.");

        var passwordHash = BCrypt.Net.BCrypt.HashPassword(cmd.Password);
        // ⚠️ Force role to Citizen for public registration
        var user = User.Create(
            email: cmd.Email.ToLower().Trim(),
            passwordHash: passwordHash,
            fullName: cmd.FullName.Trim(),
            role: UserRole.Citizen  // ← Always Citizen
        );

        _db.Users.Add(user);
        await _db.SaveChangesAsync();

        return BuildResponse(user);
    }

    // ── Login ────────────────────────────────────────────────────────────
    public async Task<AuthResponse> LoginAsync(LoginCommand cmd)
    {
        var user = await _db.Users
            .FirstOrDefaultAsync(u => u.Email == cmd.Email.ToLower());

        if (user == null || !BCrypt.Net.BCrypt.Verify(cmd.Password, user.PasswordHash))
            throw new UnauthorizedAccessException("Email hoặc mật khẩu không đúng.");

        if (!user.IsActive)
            throw new UnauthorizedAccessException("Tài khoản đã bị khóa.");

        return BuildResponse(user);
    }

    // ── Helper ───────────────────────────────────────────────────────────
    private AuthResponse BuildResponse(User user)
    {
        var token = _jwtService.GenerateToken(user);
        return new AuthResponse
        {
            Token     = token,
            ExpiresAt = DateTime.UtcNow.AddHours(1),
            UserId    = user.Id,
            FullName  = user.FullName,
            Email     = user.Email,
            Role      = user.Role.ToString()
        };
    }
}
