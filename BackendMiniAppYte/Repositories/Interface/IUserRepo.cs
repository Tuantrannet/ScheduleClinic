using Backend.Entities;

namespace Backend.Repositories.Interface
{
    public interface IUserRepo
    {
        Task<User?> GetByIdAsync(int id);

        Task<User?> GetByUserNameAsync(string username);

        IQueryable<User> GetAllAsync();

        Task AddAsync(User user);

        Task UpdateAsync(User user);
    }
}
