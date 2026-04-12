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
using WastePlatform.API.Hubs;
using WastePlatform.Infrastructure.Hubs;

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

builder.Services.AddAuthorization(options =>
{
    options.AddPolicy("RequireRole:Enterprise", policy =>
        policy.RequireClaim("http://schemas.microsoft.com/ws/2008/06/identity/claims/role", "Enterprise"));
    
    options.AddPolicy("RequireRole:Citizen", policy =>
        policy.RequireClaim("http://schemas.microsoft.com/ws/2008/06/identity/claims/role", "Citizen"));
    
    options.AddPolicy("RequireRole:Admin", policy =>
        policy.RequireClaim("http://schemas.microsoft.com/ws/2008/06/identity/claims/role", "Admin"));
});

// ── Application Services ─────────────────────────────────────────────
builder.Services.AddScoped<IJwtService, JwtService>();
builder.Services.AddScoped<AuthService>();
builder.Services.AddScoped<INotificationRealTimeService, NotificationRealTimeService>();

// 👉 ĐÃ THÊM: Đăng ký UserRepository để chọc xuống Database
builder.Services.AddScoped<IUserRepository, UserRepository>();
builder.Services.AddScoped<IDashboardRepository, DashboardRepository>();
builder.Services.AddScoped<IEnterpriseRepository, EnterpriseRepository>();

// Repositories for Reports and Categories
builder.Services.AddScoped<IReportRepository, ReportRepository>();
builder.Services.AddScoped<IWasteCategoryRepository, WasteCategoryRepository>();
builder.Services.AddScoped<IFileStorageService, LocalFileStorageService>();

// 👉 Repositories for Admin Module
builder.Services.AddScoped<IComplaintRepository, ComplaintRepository>();
builder.Services.AddScoped<IAnalyticsRepository, AnalyticsRepository>();

// 👉 Repositories for Citizen Module (Rewards & Complaints)
builder.Services.AddScoped<IRewardPointsRepository, RewardPointsRepository>();
builder.Services.AddScoped<INotificationRepository, NotificationRepository>();

// Đăng ký MediatR để xử lý CQRS (Queries/Commands)
builder.Services.AddMediatR(cfg => cfg.RegisterServicesFromAssemblies(AppDomain.CurrentDomain.GetAssemblies()));

// Đăng ký SignalR cho Real-time Updates (WRP-113)
builder.Services.AddSignalR();

// ── CORS ─────────────────────────────────────────────────────────────
builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowAll", corsBuilder =>
        corsBuilder
            .AllowAnyOrigin()
            .AllowAnyMethod()
            .AllowAnyHeader());
});

// ── Controllers & Swagger ─────────────────────────────────────────────
builder.Services.AddControllers();
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen(
    options =>
    {
        // Thêm mô tả cho JWT Authentication
        options.AddSecurityDefinition("Bearer", new Microsoft.OpenApi.Models.OpenApiSecurityScheme
        {
            Name = "Authorization",
            Type = Microsoft.OpenApi.Models.SecuritySchemeType.Http,
            Scheme = "bearer",
            BearerFormat = "JWT",
            In = Microsoft.OpenApi.Models.ParameterLocation.Header,
            Description = "Nhập 'Bearer' theo sau là token JWT của bạn."
        });

        options.AddSecurityRequirement(new Microsoft.OpenApi.Models.OpenApiSecurityRequirement
        {
            {
                new Microsoft.OpenApi.Models.OpenApiSecurityScheme
                {
                    Reference = new Microsoft.OpenApi.Models.OpenApiReference
                    {
                        Type = Microsoft.OpenApi.Models.ReferenceType.SecurityScheme,
                        Id = "Bearer"
                    }
                },
                Array.Empty<string>()
            }
        });
    }
);

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
else
{
    // Enable Swagger in Production for debugging
    app.UseSwagger();
    app.UseSwaggerUI(c =>
    {
        c.RoutePrefix = "swagger";
        c.SwaggerEndpoint("/swagger/v1/swagger.json", "Waste Platform API V1");
    });
}

// Explicitly configure static files for the uploads directory
var uploadsPath = Path.Combine(builder.Environment.ContentRootPath, "uploads");
if (!Directory.Exists(uploadsPath))
{
    Directory.CreateDirectory(uploadsPath);
}

app.UseStaticFiles(new StaticFileOptions
{
    FileProvider = new Microsoft.Extensions.FileProviders.PhysicalFileProvider(uploadsPath),
    RequestPath = "/uploads"
});

// NOTE: No UseHttpsRedirection() — Docker runs plain HTTP on port 8080
app.UseCors("AllowAll");
app.UseAuthentication();
app.UseAuthorization();
app.MapControllers();

// Map SignalR Hub
app.MapHub<TaskHub>("/hubs/task");
app.MapHub<NotificationHub>("/hubs/notifications");

app.Run();