using Microsoft.AspNetCore.Mvc.Filters;
using Microsoft.AspNetCore.Mvc;

namespace Backend.Filters
{
    public class ZaloIdAuthorizeAttribute : Attribute, IAuthorizationFilter
    {
        public void OnAuthorization(AuthorizationFilterContext context)
        {
            if (!context.HttpContext.Items.ContainsKey("zalo_id"))
            {
                context.Result = new UnauthorizedResult();
            }
        }
    }
}
