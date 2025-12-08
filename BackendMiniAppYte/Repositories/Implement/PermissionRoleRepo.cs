using Backend.Entities;
using Backend.Repositories.Interface;
using Microsoft.EntityFrameworkCore;

namespace Backend.Repositories.Implement
{
    public class PermissionRoleRepo : IPermissionRoleRepo
    {
        private readonly DataContext dataContext;

        public PermissionRoleRepo(DataContext dataContext)
        {
            this.dataContext = dataContext;
        }

        public async Task AddPermissionRoleAsync(PermissionRole permissionRole)
        {
            await dataContext.PermissionRoles.AddAsync(permissionRole).AsTask();
        }

        public async Task<bool> DeleteAsync(int permissionId, int roleId)
        {
            var affect = await dataContext.PermissionRoles
                            .Where(x=> x.PermissionId== permissionId && x.RoleId == roleId)
                            .ExecuteDeleteAsync();

            return affect > 0;
        }

        public async Task<bool> ExistAsync(int roleId, int permissionId)
        {
            var result = await dataContext.PermissionRoles.AnyAsync(x => x.RoleId == roleId && x.PermissionId == permissionId);
            return result;
        }

        //Loading
        public IQueryable<PermissionRole> PermissionRolesTableByRoleId(IEnumerable<int> roleIds)
        {
            return  dataContext.PermissionRoles.AsNoTracking().Where(x=> roleIds.Contains(x.RoleId));
        }

        public IQueryable<PermissionRole> PermissionRolesTable()
        {
            return dataContext.PermissionRoles.AsNoTracking().AsQueryable();
        }
    }
}
