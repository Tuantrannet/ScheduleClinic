using Backend.DTO.Request;
using Backend.Entities;

namespace Backend.Service.IService
{
    public interface IUserService
    {
        Task AddAsync(UserRequestDto user);
        Task<bool> IsExist(string userName);
        Task<bool> LoginAsync(UserRequestDto user);
        Task DeleteUser(int id);
        Task<List<User>> GetAllUsersAsync();

        Task<User> GetByUserName(string userName);
        Task UpdateActive(int id);
        Task UpdatePass(int id, string pass);
    }
}
