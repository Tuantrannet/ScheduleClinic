using Backend.Entities;

namespace Backend.Service.IService
{
    public interface IUserService
    {
        Task<User?> GetUserByIdAsync(int id);

        Task<User?> GetUserByUserNameAsync(string username);

        Task<List<User>> GetAllUsersAsync();

        Task<bool> UpdateUserAsync(User user);

        Task<bool> DeleteUserAsync(int id);

        Task<bool> CheckUserExistsAsync(string userName);
    }
}
