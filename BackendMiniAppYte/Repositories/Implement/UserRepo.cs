using Backend.Entities;
using Microsoft.EntityFrameworkCore;

namespace Backend.Repositories.Implement
{
    public class UserRepo
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

        public IQueryable<User> GetAllAsync()
        {
            return dataContext.Users.AsQueryable();
        }

        public async Task AddAsync(User user)
        {
            await  dataContext.Users.AddAsync(user);
        }

        public async Task UpdateAsync(User user)
        {
             dataContext.Users.Update(user);
        }

        public async Task DeleteAsync(int id)
        {
            var user = await  dataContext.Users.Where(x=> x.UserId == id).ExecuteDeleteAsync();

        }
    }
}
