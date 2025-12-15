using Backend.Enities;
using Backend.Entities;

namespace Backend.Repositories.Interface
{
    public interface IRefreshTokenRepo
    {
        Task AddAsync(RefreshToken patient);
        Task<RefreshToken?> GetByTokenAsync(string token);
        Task<bool> UpdateAsync(RefreshToken refreshToken);

    }
}
