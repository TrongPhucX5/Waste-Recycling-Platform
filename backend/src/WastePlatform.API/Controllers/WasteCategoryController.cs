using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using WastePlatform.Infrastructure.Persistence;

namespace WastePlatform.API.Controllers;

[ApiController]
[Route("api/waste-categories")]
public class WasteCategoryController : ControllerBase
{
    private readonly WastePlatformDbContext _context;

    public WasteCategoryController(WastePlatformDbContext context)
    {
        _context = context;
    }

    /// <summary>Lấy danh sách tất cả các loại rác</summary>
    /// <remarks>
    /// Endpoint này trả về danh sách các loại rác có sẵn trong hệ thống
    /// 
    /// Không yêu cầu xác thực - endpoint công khai
    /// </remarks>
    [HttpGet]
    public async Task<IActionResult> GetAllCategories()
    {
        try
        {
            var categories = await _context.WasteCategories
                .OrderBy(c => c.Name)
                .Select(c => new
                {
                    id = c.Id,
                    name = c.Name,
                    description = c.Description
                })
                .ToListAsync();

            var response = new
            {
                message = "Categories retrieved successfully",
                data = categories
            };

            return Ok(response);
        }
        catch (Exception ex)
        {
            return StatusCode(500, new { message = "Internal server error", error = ex.Message });
        }
    }

    /// <summary>Lấy chi tiết loại rác theo ID</summary>
    [HttpGet("{id}")]
    public async Task<IActionResult> GetCategoryById(int id)
    {
        try
        {
            var category = await _context.WasteCategories
                .Where(c => c.Id == id)
                .Select(c => new
                {
                    id = c.Id,
                    name = c.Name,
                    description = c.Description
                })
                .FirstOrDefaultAsync();

            if (category == null)
                return NotFound(new { message = "Category not found" });

            var response = new
            {
                message = "Category retrieved successfully",
                data = category
            };

            return Ok(response);
        }
        catch (Exception ex)
        {
            return StatusCode(500, new { message = "Internal server error", error = ex.Message });
        }
    }
}
