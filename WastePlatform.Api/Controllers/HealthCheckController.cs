using Microsoft.AspNetCore.Mvc;

namespace WastePlatform.Api.Controllers;

[ApiController]
[Route("api/[controller]")]
public class HealthCheckController : ControllerBase
{
    /// <summary>
    /// Health check endpoint to verify API is running
    /// </summary>
    [HttpGet("ping")]
    public IActionResult Ping()
    {
        return Ok(new { message = "API is running", timestamp = DateTime.UtcNow });
    }

    /// <summary>
    /// Get API version and status
    /// </summary>
    [HttpGet("status")]
    public IActionResult Status()
    {
        return Ok(new
        {
            status = "healthy",
            version = "1.0.0",
            timestamp = DateTime.UtcNow
        });
    }
}
