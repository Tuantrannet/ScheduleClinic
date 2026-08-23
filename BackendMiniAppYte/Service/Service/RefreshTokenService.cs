using AutoMapper;
using Backend.Entities;
using Backend.Repositories.Interface;
using Backend.Service.IService;

namespace Backend.Service.Service
{
    public class RefreshTokenService : IRefreshTokenService
    {
        private readonly IUnitOfWork _unitOfWork;
        private readonly IRefreshTokenRepo _refreshTokenRepo;

        private readonly TimeSpan _refreshLifetime = TimeSpan.FromDays(30);

        public RefreshTokenService(IUnitOfWork unitOfWork, IRefreshTokenRepo refreshTokenRepo)
        {
            this._unitOfWork = unitOfWork;
            this._refreshTokenRepo = refreshTokenRepo;
        }
        public async Task<RefreshToken> CreateRefreshTokenAsync()
        {
            var token = GenerateRefreshTokenString();

            var model = new RefreshToken
            {
                Token = token,
                CreatedAt = DateTime.UtcNow,
                ExpiresAt = DateTime.UtcNow.Add(_refreshLifetime),
            };

            await _refreshTokenRepo.AddAsync(model);

            await _unitOfWork.SaveChanges();

            return model;
        }

        public async Task<RefreshToken?> GetByTokenAsync(string token)
        {
            return await _refreshTokenRepo.GetByTokenAsync(token);
        }


        public async Task<RefreshToken> RotateRefreshTokenAsync(RefreshToken existing)
        {
            if (existing == null) throw new ArgumentNullException(nameof(existing));
            if (existing.ExpiresAt < DateTime.UtcNow) throw new InvalidOperationException("refresh token expired");

            var newToken = GenerateRefreshTokenString();
            existing.Token = newToken;
            existing.ExpiresAt = DateTime.UtcNow.Add(_refreshLifetime);
            existing.CreatedAt = DateTime.UtcNow;

            var affect = await _refreshTokenRepo.UpdateAsync(existing);
            if (!affect)
            {
                throw new Exception("Failed to update refresh token");
            }

            await _unitOfWork.SaveChanges();
            return existing;
        }
        private string GenerateRefreshTokenString()
        {
            return Convert.ToBase64String(Guid.NewGuid().ToByteArray());
        }
    }
}
