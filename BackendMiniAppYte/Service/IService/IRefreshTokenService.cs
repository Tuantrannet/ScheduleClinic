using Backend.Entities;

namespace Backend.Service.IService
{
    public interface IRefreshTokenService
    {
        Task<RefreshToken> CreateRefreshTokenAsync(string zaloId);
        Task<RefreshToken?> GetByTokenAsync(string token);
        Task<RefreshToken> RotateRefreshTokenAsync(RefreshToken existing);
    }
}
