using Backend.Entities;
using Microsoft.EntityFrameworkCore;

namespace Backend.Repositories.Implement
{
    public class PermissionRoleRepo
    {
        private readonly DataContext dataContext;

        public PermissionRoleRepo(DataContext dataContext)
        {
            this.dataContext = dataContext;
        }

        public async Task AddPermissionRoleAsync(PermissionRole permissionRole)
        {
            await dataContext.PermissionRoles.AddAsync(permissionRole);
        }

        public async Task<bool> DeleteAsync(int permissionId, int roleId)
        {
            var affect = await dataContext.PermissionRoles
                            .Where(x=> x.PermmissionId== permissionId && x.RoleId == roleId)
                            .ExecuteDeleteAsync();

            return affect > 0;
        }

        public async Task<bool> ExistAsync(int roleId, int permissionId)
        {
            var result = await dataContext.PermissionRoles.AnyAsync(x => x.RoleId == roleId && x.PermmissionId == permissionId);
            return result;
        }

        //Loading
        public IQueryable<PermissionRole> PermissionRolesTable(IEnumerable<int> roleIds)
        {
            return  dataContext.PermissionRoles.AsNoTracking().Where(x=> roleIds.Contains(x.RoleId));
        }
    }
}
