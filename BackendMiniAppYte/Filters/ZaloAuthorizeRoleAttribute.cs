using Microsoft.AspNetCore.Mvc.Filters;
using Microsoft.AspNetCore.Mvc;

namespace Backend.Filters
{
    public class ZaloAuthorizeRoleAttribute : Attribute, IAuthorizationFilter
    {
        private readonly string[] _roles;

        public ZaloAuthorizeRoleAttribute(params string[] roles)
        {
            _roles = roles;
        }

        public void OnAuthorization(AuthorizationFilterContext context)
        {
            if (!context.HttpContext.Items.TryGetValue("zalo_id", out _))
            {
                context.Result = new UnauthorizedResult();
                return;
            }

            if (!context.HttpContext.Items.TryGetValue("role", out var roleObj))
            {
                context.Result = new ForbidResult();
                return;
            }

            var role = roleObj.ToString();

            if (!_roles.Contains(role))
            {
                context.Result = new ForbidResult();
            }
        }
    }
}
