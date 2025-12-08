using Backend.Entities;
using Backend.Repositories.Interface;
using Backend.Service.IService;
using Microsoft.EntityFrameworkCore;

namespace Backend.Service.Service
{
    public class AuthorizationService : IAuthorizationService
    {
        private readonly IUserRoleRepo userRoleRepo;
        private readonly IRoleRepo roleRepo;
        private readonly IPermissionRoleRepo permissionRoleRepo;
        private readonly IPermissionRepo permissionRepo;

        public AuthorizationService(IUserRoleRepo userRoleRepo,IRoleRepo roleRepo
            ,IPermissionRoleRepo permissionRoleRepo,
            IPermissionRepo permissionRepo)
        {
            this.userRoleRepo = userRoleRepo;
            this.roleRepo = roleRepo;
            this.permissionRoleRepo = permissionRoleRepo;
            this.permissionRepo = permissionRepo;
        }

        public async Task<IEnumerable<string>> GetUserRolesAsync(int userId)
        {
            var userRolesQuery = userRoleRepo.UserRoleTableByUserId(userId);

            var query=(
                from x in userRolesQuery
                join y in roleRepo.RolesTable() on x.RoleId equals y.RoleId
                select y.RoleName
                );

            var result = await query.ToListAsync();

            return result;

        }

        
        //Add to JWT
        public async Task<IEnumerable<string>> GetUserPermissionAsync(int userId)
        {
            var userRolesQuery = userRoleRepo.UserRoleTableByUserId(userId); // UserRole -> List Role


            var query = from x in permissionRepo.PermissionTable()
                        join y in permissionRoleRepo.PermissionRolesTable() on x.PermissionId equals y.PermissionId
                        join z in userRolesQuery on y.RoleId equals z.RoleId
                        select x.CodeName;

            var permissionNames = await query.Distinct().ToListAsync();

            return permissionNames;
        }

        //Check xem user có role tồn tại không

        public async Task<bool> CheckUserHasRoleAsync(int userId, string roleName)
        {
            var userRoles = userRoleRepo.UserRoleTableByUserId(userId);

            var query = (from x in userRoles
                         join y in roleRepo.RolesTable() on x.RoleId equals y.RoleId
                         select new { y.RoleName });

            var result = await query.AnyAsync(r =>
                            r.RoleName.Equals(roleName, StringComparison.OrdinalIgnoreCase));

            return result;
;

            

        }
        

    }

}
