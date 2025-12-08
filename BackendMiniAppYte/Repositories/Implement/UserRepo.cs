using Backend.Entities;
using Backend.Repositories.Interface;
using Microsoft.EntityFrameworkCore;

namespace Backend.Repositories.Implement
{
    public class UserRepo : IUserRepo
    {
        private readonly DataContext dataContext;

        public UserRepo(DataContext dataContext)
        {
            this.dataContext = dataContext;
        }

        public async Task<User?> GetByIdAsync(int id)
        {
            return await  dataContext.Users
                .Include(u => u.UserRoles)
                .ThenInclude(ur => ur.Role)
                .FirstOrDefaultAsync(u => u.UserId == id);
        }

        public async Task<User?> GetByUserNameAsync(string username)
        {
            return await  dataContext.Users
                .Include(u => u.UserRoles)
                .ThenInclude(ur => ur.Role)
                .FirstOrDefaultAsync(u => u.UserName == username);
        }

        public async Task<bool> CheckUserIsExist(string userName)
        {
            var result = await dataContext.Users.AnyAsync(x=> x.UserName == userName);
            return result;
        }

        public IQueryable<User> GetAllAsync()
        {
            return dataContext.Users.AsQueryable().AsNoTracking();
        }

        public async Task AddAsync(User user)
        {
            await  dataContext.Users.AddAsync(user);
        }

        public async Task<bool> UpdateAsync(User user)
        {
            var affected = await dataContext.Users
                               .Where(x => x.UserId == user.UserId)
                               .ExecuteUpdateAsync(x => x
                                   .SetProperty(u => u.UserName, user.UserName)
                                   .SetProperty(u => u.PasswordHash, user.PasswordHash)
                                   .SetProperty(u => u.IsActive, user.IsActive));

            return affected > 0;
        }

        public async Task DeleteAsync(int id)
        {
            var user = await  dataContext.Users.Where(x=> x.UserId == id).ExecuteDeleteAsync();

        }

        public async Task SaveChanges()
        {
            await dataContext.SaveChangesAsync();
        }

    }
}
