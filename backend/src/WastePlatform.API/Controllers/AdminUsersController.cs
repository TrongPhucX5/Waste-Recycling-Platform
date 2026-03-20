using MediatR;
using Microsoft.AspNetCore.Mvc;
using WastePlatform.Application.Admin.Users.Queries;
using WastePlatform.Application.Admin.Dashboard.Queries;

namespace WastePlatform.API.Controllers
{
    [Route("api/admin/users")]
    [ApiController]
    // [Authorize(Roles = "Admin")] // Mở comment dòng này khi dự án đã setup xong JWT Auth
    public class AdminUsersController : ControllerBase
    {
        private readonly IMediator _mediator;

        public AdminUsersController(IMediator mediator)
        {
            _mediator = mediator;
        }

        [HttpGet]
        public async Task<IActionResult> GetUsers([FromQuery] string? search, [FromQuery] string? role)
        {
            // Gom các tham số URL vào Query Model
            var query = new GetUsersQuery 
            { 
                Search = search, 
                Role = role 
            };

            // Gửi Query vào Application Layer xử lý
            var users = await _mediator.Send(query);

            // Bọc dữ liệu trả về theo format chuẩn { data: [...] } mà Frontend đang mong đợi
            return Ok(new { 
                message = "Lấy danh sách thành công",
                data = users 
            });
        }

        [HttpGet("stats")]
        public async Task<IActionResult> GetStats()
        {
            var stats = await _mediator.Send(new GetDashboardStatsQuery());
            return Ok(new { data = stats });
        }
    }
}