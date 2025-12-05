using Backend.Entities;
using Microsoft.EntityFrameworkCore;

namespace Backend.Repositories.Implement
{
    public class PermissionRepo
    {
        private readonly DataContext dataContext;

        public PermissionRepo(DataContext dataContext)
        {
            this.dataContext = dataContext;
        }

        public async Task<Permission?> GetByIdAsync(int Id)
        {
            var permission = await dataContext.Permissions.FirstOrDefaultAsync(x => x.PermissionId == Id);
            return permission;
        }

        public async Task<List<Permission>> GetAllAsync()
        {
            var permission = await dataContext.Permissions.AsNoTracking().ToListAsync();
            return permission;
        }

        public async Task AddPermissionAsync(Permission permission)
        {
            await dataContext.Permissions.AddAsync(permission);
        }

        public async Task<bool> UpdatePermissionAsync(Permission permission)
        {
            var affect = await dataContext.Permissions.Where(x => x.PermissionId == permission.PermissionId)
                                .ExecuteUpdateAsync(x => x.SetProperty(u => u.CodeName, permission.CodeName)
                                                          .SetProperty(u => u.GroupName, permission.GroupName));
            return affect > 0;
        }

        public async Task<bool> DeletePermissionAsync(int permissionId)
        {
            var affect = await dataContext.Permissions
                                    .Where(x => x.PermissionId == permissionId)
                                    .ExecuteDeleteAsync();

            return affect > 0;
        }

        public IQueryable<Permission> PermissionTable()
        {
            return dataContext.Permissions.AsQueryable();
        }
    }
}
