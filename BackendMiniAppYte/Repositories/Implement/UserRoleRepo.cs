using Backend.Entities;
using Backend.Repositories.Interface;
using Microsoft.EntityFrameworkCore;
using Microsoft.Identity.Client;

namespace Backend.Repositories.Implement
{
    public class UserRoleRepo : IUserRoleRepo
    {
        private readonly DataContext dataContext;

        public UserRoleRepo(DataContext dataContext)
        {
            this.dataContext = dataContext;
        }

        public async Task AddUserRoleAsync(UserRole userRole)
        {
            await dataContext.UserRoles.AddAsync(userRole);
        }

        public async Task<bool> DeleteUserRoleAsync(UserRole userRole)
        {
            var affect = await dataContext.UserRoles.Where(x=> x.UserId == userRole.UserId && x.RoleId == userRole.RoleId)
                                                    .ExecuteDeleteAsync();

            return affect > 0;
        }

        public IQueryable<UserRole> UserRoleTableByUserId(int id)
        {
            return dataContext.UserRoles.Where(x=> x.UserId == id ).AsNoTracking();
        }

        public async Task<bool> CheckExistRoleAsync(int userId, int roleId)
        {
            var results = await dataContext.UserRoles.AnyAsync(x => x.UserId == userId && x.RoleId == roleId);
            return results;
        }
    }
}
