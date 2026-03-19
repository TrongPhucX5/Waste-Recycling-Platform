using System.Security.Claims;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using WastePlatform.Application.Reports.Commands;
using WastePlatform.Application.Common.DTOs;
using WastePlatform.Domain.Enums;
using WastePlatform.Infrastructure.Persistence;

namespace WastePlatform.API.Controllers;

[ApiController]
[Route("api/reports")]
[Authorize]
public class ReportController : ControllerBase
{
    private readonly WastePlatformDbContext _context;
    private readonly IConfiguration _config;

    public ReportController(WastePlatformDbContext context, IConfiguration config)
    {
        _context = context;
        _config = config;
    }

    /// <summary>Tạo báo cáo rác mới</summary>
    /// <remarks>
    /// Endpoint này cho phép công dân tạo báo cáo về rác thải
    /// 
    /// Yêu cầu:
    /// - Authorization: Bearer token
    /// - multipart/form-data
    /// </remarks>
    [HttpPost("create")]
    [Authorize(Roles = "Citizen")]
    public async Task<IActionResult> CreateReport([FromForm] IFormCollection form)
    {
        try
        {
            // Lấy user ID từ JWT token
            var userIdClaim = User.FindFirst(ClaimTypes.NameIdentifier);
            if (userIdClaim == null || !Guid.TryParse(userIdClaim.Value, out var userId))
                return Unauthorized(new { message = "Invalid or missing user ID in token" });

            // Kiểm tra người dùng tồn tại
            var user = await _context.Users.FindAsync(userId);
            if (user == null)
                return NotFound(new { message = "User not found" });

            // Parse form data
            if (!int.TryParse(form["WasteCategoryId"], out var categoryId))
                return BadRequest(new { message = "Invalid WasteCategoryId" });

            if (!decimal.TryParse(form["Latitude"], out var latitude))
                return BadRequest(new { message = "Invalid Latitude" });

            if (!decimal.TryParse(form["Longitude"], out var longitude))
                return BadRequest(new { message = "Invalid Longitude" });

            var description = form["Description"].ToString();
            var address = form["Address"].ToString();
            var aiSuggestion = form["AiSuggestion"].ToString();

            // Kiểm tra danh mục rác tồn tại
            var category = await _context.WasteCategories.FindAsync(categoryId);
            if (category == null)
                return BadRequest(new { message = "Invalid waste category" });

            // Kiểm tra dữ liệu đầu vào
            if (latitude < -90 || latitude > 90 || longitude < -180 || longitude > 180)
                return BadRequest(new { message = "Invalid latitude or longitude coordinates" });

            // Tạo báo cáo mới
            var report = Domain.Entities.WasteReport.Create(
                citizenId: userId,
                wasteCategoryId: categoryId,
                latitude: latitude,
                longitude: longitude,
                description: description,
                address: address,
                aiSuggestion: aiSuggestion
            );

            // Xử lý ảnh tải lên
            var images = form.Files.GetFiles("Images");
            if (images != null && images.Count > 0)
            {
                var allowedExtensions = new[] { ".jpg", ".jpeg", ".png", ".gif" };
                
                foreach (var file in images)
                {
                    if (file.Length == 0)
                        continue;

                    // Xác thực loại file
                    var fileExtension = Path.GetExtension(file.FileName).ToLowerInvariant();
                    
                    if (!allowedExtensions.Contains(fileExtension))
                        return BadRequest(new { message = $"Invalid file type: {fileExtension}" });

                    // Xác thực kích thước file (5MB)
                    if (file.Length > 5 * 1024 * 1024)
                        return BadRequest(new { message = "File size exceeds 5MB limit" });

                    // Tạo tên file unique
                    var fileName = $"{Guid.NewGuid()}{fileExtension}";
                    
                    // Đơn giản: chỉ lưu filename, không cần lưu file
                    var imageUrl = fileName;
                    
                    var reportImage = new Domain.Entities.ReportImage
                    {
                        Id = Guid.NewGuid(),
                        ReportId = report.Id,
                        ImageUrl = imageUrl,
                        UploadedAt = DateTime.UtcNow
                    };
                    report.Images.Add(reportImage);
                }
            }

            // Lưu báo cáo vào database
            _context.WasteReports.Add(report);
            await _context.SaveChangesAsync();

            // Trả về response
            var response = new
            {
                message = "Report created successfully",
                report = new
                {
                    id = report.Id,
                    citizenId = report.CitizenId,
                    wasteCategoryId = report.WasteCategoryId,
                    categoryName = category.Name,
                    description = report.Description,
                    latitude = report.Latitude,
                    longitude = report.Longitude,
                    address = report.Address,
                    status = report.Status.ToString(),
                    aiSuggestion = report.AiSuggestion,
                    imageCount = report.Images.Count,
                    imageUrls = report.Images.Select(i => i.ImageUrl).ToList(),
                    createdAt = report.CreatedAt
                }
            };

            return CreatedAtAction(nameof(GetReportById), new { id = report.Id }, response);
        }
        catch (Exception ex)
        {
            return StatusCode(500, new { message = "Internal server error", error = ex.Message });
        }
    }

    /// <summary>Lấy chi tiết báo cáo theo ID</summary>
    [HttpGet("{id}")]
    public async Task<IActionResult> GetReportById(Guid id)
    {
        try
        {
            var report = await _context.WasteReports
                .Include(r => r.Citizen)
                .Include(r => r.WasteCategory)
                .Include(r => r.Images)
                .Include(r => r.RewardPoints)
                .FirstOrDefaultAsync(r => r.Id == id);

            if (report == null)
                return NotFound(new { message = "Report not found" });

            var response = new ReportDto
            {
                Id = report.Id,
                CitizenId = report.CitizenId,
                CitizenName = report.Citizen.FullName,
                WasteCategoryId = report.WasteCategoryId,
                CategoryName = report.WasteCategory?.Name,
                Description = report.Description,
                Latitude = report.Latitude,
                Longitude = report.Longitude,
                Address = report.Address,
                Status = report.Status,
                AiSuggestion = report.AiSuggestion,
                CreatedAt = report.CreatedAt,
                ImageUrls = report.Images.Select(i => i.ImageUrl).ToList(),
                RewardPoints = report.RewardPoints.Select(rp => new RewardPointsDto
                {
                    Id = rp.Id,
                    Points = rp.Points,
                    Reason = rp.Reason,
                    CreatedAt = rp.CreatedAt
                }).ToList()
            };

            return Ok(new { message = "Report retrieved successfully", report = response });
        }
        catch (Exception ex)
        {
            return StatusCode(500, new { message = "Internal server error", error = ex.Message });
        }
    }

    /// <summary>Lấy danh sách báo cáo của người dùng hiện tại</summary>
    [HttpGet("my-reports")]
    public async Task<IActionResult> GetMyReports([FromQuery] int page = 1, [FromQuery] int pageSize = 10)
    {
        try
        {
            var userIdClaim = User.FindFirst(ClaimTypes.NameIdentifier);
            if (userIdClaim == null || !Guid.TryParse(userIdClaim.Value, out var userId))
                return Unauthorized(new { message = "Invalid or missing user ID" });

            var reports = await _context.WasteReports
                .Where(r => r.CitizenId == userId)
                .Include(r => r.WasteCategory)
                .Include(r => r.Images)
                .OrderByDescending(r => r.CreatedAt)
                .Skip((page - 1) * pageSize)
                .Take(pageSize)
                .ToListAsync();

            var total = await _context.WasteReports.CountAsync(r => r.CitizenId == userId);

            var response = new
            {
                message = "Reports retrieved successfully",
                pagination = new
                {
                    page = page,
                    pageSize = pageSize,
                    total = total,
                    totalPages = (total + pageSize - 1) / pageSize
                },
                reports = reports.Select(r => new ReportListDto
                {
                    Id = r.Id,
                    CitizenName = _context.Users.FirstOrDefault(u => u.Id == r.CitizenId)?.FullName,
                    CategoryName = r.WasteCategory?.Name,
                    Status = r.Status,
                    Address = r.Address,
                    CreatedAt = r.CreatedAt,
                    ImageCount = r.Images.Count
                }).ToList()
            };

            return Ok(response);
        }
        catch (Exception ex)
        {
            return StatusCode(500, new { message = "Internal server error", error = ex.Message });
        }
    }

    /// <summary>Lấy danh sách tất cả báo cáo (Admin/Enterprise)</summary>
    [HttpGet("all")]
    [Authorize(Roles = "Admin,Enterprise")]
    public async Task<IActionResult> GetAllReports([FromQuery] int page = 1, [FromQuery] int pageSize = 10, [FromQuery] string? status = null)
    {
        try
        {
            var query = _context.WasteReports.Include(r => r.Citizen).Include(r => r.WasteCategory).Include(r => r.Images) as IQueryable<Domain.Entities.WasteReport>;

            if (!string.IsNullOrEmpty(status) && Enum.TryParse<ReportStatus>(status, true, out var reportStatus))
                query = query.Where(r => r.Status == reportStatus);

            var reports = await query
                .OrderByDescending(r => r.CreatedAt)
                .Skip((page - 1) * pageSize)
                .Take(pageSize)
                .ToListAsync();

            var total = await query.CountAsync();

            var response = new
            {
                message = "All reports retrieved successfully",
                pagination = new
                {
                    page = page,
                    pageSize = pageSize,
                    total = total,
                    totalPages = (total + pageSize - 1) / pageSize
                },
                reports = reports.Select(r => new ReportListDto
                {
                    Id = r.Id,
                    CitizenName = r.Citizen.FullName,
                    CategoryName = r.WasteCategory?.Name,
                    Status = r.Status,
                    Address = r.Address,
                    CreatedAt = r.CreatedAt,
                    ImageCount = r.Images.Count
                }).ToList()
            };

            return Ok(response);
        }
        catch (Exception ex)
        {
            return StatusCode(500, new { message = "Internal server error", error = ex.Message });
        }
    }
}
