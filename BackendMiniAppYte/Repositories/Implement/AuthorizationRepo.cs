using Backend.Repositories.Interface;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Scaffolding.Metadata;

namespace Backend.Repositories.Implement
{
    public class AuthorizationRepo : IAuthorizationRepo
    {
        private readonly DataContext dataContext;
        public AuthorizationRepo(DataContext dataContext)
        {
            this.dataContext = dataContext;
        }

        public IQueryable<string> GetUserRoleAByUserIdAsync(int userId)
        {
            var query = from x in dataContext.UserRoles.AsNoTracking()
                        join y in dataContext.Roles.AsNoTracking() on x.RoleId equals y.RoleId
                        where x.UserId == userId
                        select y.RoleName;
            return query;
        }

       
    }
}
