using Backend.DTO.Model;
using Backend.DTO.Respond;
using Backend.Entities;

namespace Backend.Service.IService
{
    public interface IAuthenService
    {
        Task RegisterUser(UserDto user);

        Task<AuthResult> Login(string userName, string password);

        Task<User?> GetByIdAsync(int Id);
    }
}
