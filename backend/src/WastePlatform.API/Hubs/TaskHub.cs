using Microsoft.AspNetCore.SignalR;
using System.Threading.Tasks;
using System.Security.Claims;
using WastePlatform.Application.Common.Interfaces;

namespace WastePlatform.API.Hubs
{
    public class TaskHub : Hub
    {
        private readonly IEnterpriseRepository _enterpriseRepository;

        public TaskHub(IEnterpriseRepository enterpriseRepository)
        {
            _enterpriseRepository = enterpriseRepository;
        }

        // When a client connects, automatically add them to role-based groups
        public override async Task OnConnectedAsync()
        {
            var role = Context.User?.FindFirst(ClaimTypes.Role)?.Value;
            if (!string.IsNullOrEmpty(role))
            {
                if (role.Equals("Admin", System.StringComparison.OrdinalIgnoreCase))
                {
                    await Groups.AddToGroupAsync(Context.ConnectionId, "Admins");
                }
                else if (role.Equals("Enterprise", System.StringComparison.OrdinalIgnoreCase))
                {
                    await Groups.AddToGroupAsync(Context.ConnectionId, "Enterprises");

                    // Try to add to enterprise-specific group if enterprise profile exists for this user
                    var userIdClaim = Context.User?.FindFirst(ClaimTypes.NameIdentifier)?.Value;
                    if (!string.IsNullOrEmpty(userIdClaim) && System.Guid.TryParse(userIdClaim, out var userId))
                    {
                        var enterprise = _enterpriseRepository.GetEnterpriseByUserIdAsync(userId, CancellationToken.None).GetAwaiter().GetResult();
                        if (enterprise != null)
                        {
                            await Groups.AddToGroupAsync(Context.ConnectionId, $"Enterprise-{enterprise.Id}");
                        }
                    }
                }
                else if (role.Equals("Collector", System.StringComparison.OrdinalIgnoreCase))
                {
                    await Groups.AddToGroupAsync(Context.ConnectionId, "Collectors");
                }
            }

            await base.OnConnectedAsync();
        }

        // Allows clients to explicitly join an enterprise-specific group (optional)
        public Task JoinEnterpriseGroup(string enterpriseId)
        {
            if (string.IsNullOrWhiteSpace(enterpriseId)) return Task.CompletedTask;
            return Groups.AddToGroupAsync(Context.ConnectionId, $"Enterprise-{enterpriseId}");
        }
    }
}
