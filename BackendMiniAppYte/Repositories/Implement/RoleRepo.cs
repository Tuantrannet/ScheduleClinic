using Backend.Entities;
using Backend.Repositories.Interface;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata;
using System.Data;

namespace Backend.Repositories.Implement
{
    public class RoleRepo : IRoleRepo
    {
        private readonly DataContext dataContext;

        public RoleRepo(DataContext dataContext)
        {
            this.dataContext = dataContext;
        }

        //Loading role
        public async Task<Role?> GetByIdAsync(int id)
        {
            var role = await dataContext.Roles.FirstOrDefaultAsync(x => x.RoleId == id);
            return role;
        }

        public async Task<List<Role>> GetAllAsync()
        {
            var role = await dataContext.Roles.ToListAsync();

            return role;
        }

        public async Task AddRoleAsync(Role role)
        {
            await dataContext.Roles.AddAsync(role);
            await dataContext.SaveChangesAsync();

        }

        public async Task<bool> UpdateRoleAsync(Role role)
        {
            var affect = await dataContext.Roles.Where(x => x.RoleId == role.RoleId)
                                .ExecuteUpdateAsync(x => x.SetProperty(u => u.RoleName, role.RoleName));

            return affect > 0;
        }

        public async Task<bool> DeleteRoleAsync(int roleId)
        {
            var affect = await dataContext.Roles.Where(x => x.RoleId == roleId)
                                    .ExecuteDeleteAsync();    
            
            return affect > 0;
        }


        //Phục vụ cho việc Join
        public IQueryable<Role> RolesTable()
        {
            return dataContext.Roles.AsQueryable().AsNoTracking();
        }
    }
}
