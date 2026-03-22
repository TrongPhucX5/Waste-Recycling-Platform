using System.Security.Claims;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using WastePlatform.Domain.Entities;
using WastePlatform.Domain.Enums;
using WastePlatform.Infrastructure.Persistence;

namespace WastePlatform.API.Controllers;

[ApiController]
[Route("api/collector/tasks")]
[Authorize(Roles = "Collector")]
public class CollectorTaskController : ControllerBase
{
    private readonly WastePlatformDbContext _context;

    public CollectorTaskController(WastePlatformDbContext context)
    {
        _context = context;
    }

    private async Task<Collector?> GetCurrentCollectorAsync()
    {
        var userIdClaim = User.FindFirst(ClaimTypes.NameIdentifier);
        if (userIdClaim == null || !Guid.TryParse(userIdClaim.Value, out var userId))
            return null;

        return await _context.Collectors
            .Include(c => c.User)
            .FirstOrDefaultAsync(c => c.UserId == userId);
    }

    /// <summary>
    /// Lấy danh sách nhiệm vụ thu gom của Collector hiện tại
    /// </summary>
    [HttpGet]
    public async Task<IActionResult> GetTasks([FromQuery] CollectionTaskStatus? status = null)
    {
        var collector = await GetCurrentCollectorAsync();
        if (collector == null)
            return Unauthorized(new { message = "Collector profile not found for current user." });

        var query = _context.CollectionTasks
            .Include(t => t.WasteReport)
                .ThenInclude(r => r.WasteCategory)
            .Include(t => t.WasteReport)
                .ThenInclude(r => r.Citizen)
            .Include(t => t.Images)
            .Where(t => t.CollectorId == collector.Id);

        if (status.HasValue)
        {
            query = query.Where(t => t.Status == status.Value);
        }

        var tasks = await query
            .OrderByDescending(t => t.AssignedAt)
            .Select(t => new
            {
                t.Id,
                t.ReportId,
                t.EnterpriseId,
                t.CollectorId,
                Status = t.Status.ToString(),
                t.CollectedWeightKg,
                t.Notes,
                t.AssignedAt,
                t.CompletedAt,
                Report = new
                {
                    t.WasteReport.Id,
                    t.WasteReport.Description,
                    t.WasteReport.Address,
                    t.WasteReport.Latitude,
                    t.WasteReport.Longitude,
                    Status = t.WasteReport.Status.ToString(),
                    CategoryName = t.WasteReport.WasteCategory != null ? t.WasteReport.WasteCategory.Name : null,
                    CitizenName = t.WasteReport.Citizen.FullName,
                    CitizenPhone = t.WasteReport.Citizen.Phone
                }
            })
            .ToListAsync();

        return Ok(tasks);
    }

    /// <summary>
    /// Cập nhật trạng thái nhiệm vụ thành "On the way" (Đang di chuyển)
    /// </summary>
    [HttpPut("{id}/on-the-way")]
    public async Task<IActionResult> SetOnTheWay(Guid id)
    {
        var collector = await GetCurrentCollectorAsync();
        if (collector == null)
            return Unauthorized(new { message = "Collector profile not found." });

        var task = await _context.CollectionTasks.FirstOrDefaultAsync(t => t.Id == id && t.CollectorId == collector.Id);
        if (task == null)
            return NotFound(new { message = "Task not found or not assigned to you." });

        try
        {
            task.SetOnTheWay();
            await _context.SaveChangesAsync();

            return Ok(new { message = "Task status updated to OnTheWay.", taskId = id });
        }
        catch (InvalidOperationException ex)
        {
            return BadRequest(new { message = ex.Message });
        }
    }

    /// <summary>
    /// Cập nhật trạng thái nhiệm vụ thành "Collected" (Đã thu gom) kèm theo khối lượng, ghi chú và hình ảnh
    /// </summary>
    [HttpPut("{id}/complete")]
    public async Task<IActionResult> CompleteTask(Guid id, [FromForm] IFormCollection form)
    {
        var collector = await GetCurrentCollectorAsync();
        if (collector == null)
            return Unauthorized(new { message = "Collector profile not found." });

        var task = await _context.CollectionTasks
            .Include(t => t.WasteReport)
            .FirstOrDefaultAsync(t => t.Id == id && t.CollectorId == collector.Id);
            
        if (task == null)
            return NotFound(new { message = "Task not found or not assigned to you." });

        if (!decimal.TryParse(form["WeightKg"], out var weightKg))
            return BadRequest(new { message = "Invalid or missing WeightKg." });

        var notes = form["Notes"].ToString();

        try
        {
            task.Complete(weightKg, notes);
            
            // Xử lý hình ảnh xác nhận (nếu có)
            var images = form.Files.GetFiles("Images");
            if (images != null && images.Count > 0)
            {
                var allowedExtensions = new[] { ".jpg", ".jpeg", ".png", ".gif" };
                var uploadFolder = Path.Combine(Directory.GetCurrentDirectory(), "wwwroot", "uploads", "tasks");
                if (!Directory.Exists(uploadFolder))
                    Directory.CreateDirectory(uploadFolder);

                foreach (var file in images)
                {
                    if (file.Length == 0) continue;

                    var fileExtension = Path.GetExtension(file.FileName).ToLowerInvariant();
                    if (!allowedExtensions.Contains(fileExtension))
                        continue;

                    var fileName = $"{Guid.NewGuid()}{fileExtension}";
                    var filePath = Path.Combine(uploadFolder, fileName);
                    
                    using (var stream = new FileStream(filePath, FileMode.Create))
                    {
                        await file.CopyToAsync(stream);
                    }

                    var imageUrl = $"/uploads/tasks/{fileName}";
                    _context.CollectionImages.Add(new CollectionImage
                    {
                        TaskId = task.Id,
                        ImageUrl = imageUrl
                    });
                }
            }

            // Đồng thời cập nhật trạng thái Report sang Collected
            task.WasteReport.Collect();

            await _context.SaveChangesAsync();

            return Ok(new { message = "Task completed successfully.", taskId = id });
        }
        catch (InvalidOperationException ex)
        {
            return BadRequest(new { message = ex.Message });
        }
    }
    
    /// <summary>
    /// Lấy thống kê công việc của Collector (Dashboard)
    /// </summary>
    [HttpGet("stats")]
    public async Task<IActionResult> GetStats()
    {
        var collector = await GetCurrentCollectorAsync();
        if (collector == null)
            return Unauthorized(new { message = "Collector profile not found." });

        var tasks = await _context.CollectionTasks
            .Where(t => t.CollectorId == collector.Id)
            .ToListAsync();

        var totalAssigned = tasks.Count(t => t.Status == CollectionTaskStatus.Assigned);
        var totalOnTheWay = tasks.Count(t => t.Status == CollectionTaskStatus.OnTheWay);
        var totalCollected = tasks.Count(t => t.Status == CollectionTaskStatus.Collected);
        var totalWeight = tasks.Where(t => t.Status == CollectionTaskStatus.Collected && t.CollectedWeightKg.HasValue)
                               .Sum(t => t.CollectedWeightKg!.Value);

        return Ok(new
        {
            TotalAssigned = totalAssigned,
            TotalOnTheWay = totalOnTheWay,
            TotalCollected = totalCollected,
            TotalWeightKg = totalWeight
        });
    }
}
