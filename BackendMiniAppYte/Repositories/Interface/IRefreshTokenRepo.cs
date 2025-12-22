using Backend.Entities;

namespace Backend.Repositories.Interface
{
    public interface IRefreshTokenRepo
    {
        Task AddAsync(RefreshToken token);
        Task<RefreshToken?> GetByHashAsync(string tokenHash);
        Task<IEnumerable<RefreshToken>> GetByUserIdAsync(int userId);
        Task<bool> Update_RevokeRT_ByToken(int id, string RT2);
        Task Delete_RefreshToken();




    }
}
