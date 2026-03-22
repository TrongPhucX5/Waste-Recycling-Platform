using Microsoft.EntityFrameworkCore;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.IdentityModel.Tokens;
using System.Text;
using System.Reflection; 
using WastePlatform.Application.Common.Interfaces;
using WastePlatform.Infrastructure.Persistence;
using WastePlatform.Infrastructure.Services;
// Thêm thư mục chứa UserRepository (điều chỉnh lại nếu bạn để thư mục khác nhé)
using WastePlatform.Infrastructure.Persistence.Repositories; 

var builder = WebApplication.CreateBuilder(args);

// ── Database ────────────────────────────────────────────────────────
var connectionString = builder.Configuration.GetConnectionString("DefaultConnection")
    ?? throw new InvalidOperationException("Connection string 'DefaultConnection' not found.");

builder.Services.AddDbContext<WastePlatformDbContext>(options =>
    options.UseMySql(connectionString, ServerVersion.AutoDetect(connectionString))
);

// ── JWT Authentication ───────────────────────────────────────────────
var jwtSecret = builder.Configuration["JwtSettings:SecretKey"]
    ?? throw new InvalidOperationException("JWT SecretKey not configured.");

builder.Services.AddAuthentication(JwtBearerDefaults.AuthenticationScheme)
    .AddJwtBearer(options =>
    {
        options.TokenValidationParameters = new TokenValidationParameters
        {
            ValidateIssuer           = true,
            ValidateAudience         = true,
            ValidateLifetime         = true,
            ValidateIssuerSigningKey = true,
            ValidIssuer              = builder.Configuration["JwtSettings:Issuer"],
            ValidAudience            = builder.Configuration["JwtSettings:Audience"],
            IssuerSigningKey         = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(jwtSecret))
        };
    });

builder.Services.AddAuthorization();

// ── Application Services ─────────────────────────────────────────────
builder.Services.AddScoped<IJwtService, JwtService>();
builder.Services.AddScoped<AuthService>();

// 👉 ĐÃ THÊM: Đăng ký UserRepository để chọc xuống Database
builder.Services.AddScoped<IUserRepository, UserRepository>();
builder.Services.AddScoped<IDashboardRepository, DashboardRepository>();

// Repositories for Reports and Categories
builder.Services.AddScoped<IReportRepository, ReportRepository>();
builder.Services.AddScoped<IWasteCategoryRepository, WasteCategoryRepository>();
builder.Services.AddScoped<IFileStorageService, LocalFileStorageService>();

// Đăng ký MediatR để xử lý CQRS (Queries/Commands)
builder.Services.AddMediatR(cfg => cfg.RegisterServicesFromAssemblies(AppDomain.CurrentDomain.GetAssemblies()));

// ── CORS ─────────────────────────────────────────────────────────────
builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowAll", corsBuilder =>
        corsBuilder.AllowAnyOrigin().AllowAnyMethod().AllowAnyHeader());
});

// ── Controllers & Swagger ─────────────────────────────────────────────
builder.Services.AddControllers();
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

var app = builder.Build();

// ── Database is initialized via SQL migration scripts in docker-compose ───
// The db/migrations folder is mounted to /docker-entrypoint-initdb.d in MySQL
// Auto-migration is skipped since DDL is managed by versioned SQL files

// ── Middleware pipeline ───────────────────────────────────────────────
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

// Static files for uploads
app.UseStaticFiles();

// NOTE: No UseHttpsRedirection() — Docker runs plain HTTP on port 8080
app.UseCors("AllowAll");
app.UseAuthentication();
app.UseAuthorization();
app.MapControllers();

app.Run();