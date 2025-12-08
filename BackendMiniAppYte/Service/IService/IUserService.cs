using Backend.DTO.Request;
using Backend.Entities;

namespace Backend.Service.IService
{
    public interface IUserService
    {
        Task RegisterUser(UserDto user);

        Task Login(string userName, string password);

        Task<User?> GetByIdAsync(int Id);
    }
}
