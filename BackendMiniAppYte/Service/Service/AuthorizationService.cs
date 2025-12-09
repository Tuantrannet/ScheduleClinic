using Backend.Entities;
using Backend.Repositories.Interface;
using Backend.Service.IService;
using Microsoft.EntityFrameworkCore;

namespace Backend.Service.Service
{
    public class AuthorizationService : IAuthorizationService
    {
        private readonly IAuthorizationRepo authorizationRepo;

        public AuthorizationService(IAuthorizationRepo authorizationRepo)
        {
            this.authorizationRepo = authorizationRepo;
        }

        public async Task<IEnumerable<string>> GetUserRolesAsync(int userId)
        {
            var query = authorizationRepo.GetUserRoleAByUserIdAsync(userId);

            var result = await query.ToListAsync();

            return result;

        }

        

        //Check xem user có role tồn tại không

        public async Task<bool> CheckUserHasRoleAsync(int userId, string roleName)
        {
            var query = authorizationRepo.GetUserRoleAByUserIdAsync(userId);

            var result = await query.AnyAsync(r =>
                            r.Equals(roleName, StringComparison.OrdinalIgnoreCase));

            return result;

        }
        

    }

}
