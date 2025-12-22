using Backend.DTO.Model;
using Backend.DTO.Respond;
using Backend.Entities;

namespace Backend.Service.IService
{
    public interface IAuthenService
    {
        Task Register_User(UserDto user);

        Task<AuthResult> Login(string userName, string password);

        Task<AuthResult> Refresh_RT_And_AT(string refreshToken);

        Task<User?> Get_By_Id_Async(int Id);

        Task Clean_Up_RefreshToken();
    }
}
