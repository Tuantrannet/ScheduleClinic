using Backend.Entities;
using Backend.Repositories.Interface;
using Microsoft.EntityFrameworkCore;

namespace Backend.Repositories.Implement
{
    public class RefreshTokenRepo : IRefreshTokenRepo
    {
        private readonly DataContext dataContext;

        public RefreshTokenRepo(DataContext dataContext)
        {
            this.dataContext = dataContext;
        }

        public async Task AddAsync(RefreshToken token)
        {
            await dataContext.RefreshTokens.AddAsync(token);
        }

        public async Task<RefreshToken?> GetByHashAsync(string tokenHash)
        {
            return await dataContext.RefreshTokens.FirstOrDefaultAsync(x => x.TokenHash == tokenHash);
        }

        public async Task<IEnumerable<RefreshToken>> GetByUserIdAsync(int userId)
        {
            return await dataContext.RefreshTokens.Where(x => x.UserId == userId).ToListAsync();
        }

        public async Task UpdateAsync(RefreshToken token)
        {
            await dataContext.RefreshTokens
                .Where(x => x.Id == token.Id)
                .ExecuteUpdateAsync(s => s
                    .SetProperty(r => r.UserId, token.UserId)
                    .SetProperty(r => r.TokenHash, token.TokenHash)
                    .SetProperty(r => r.ExpiresAt, token.ExpiresAt)
                    .SetProperty(r => r.CreatedAt, token.CreatedAt)
                    .SetProperty(r => r.CreatedByIp, token.CreatedByIp)
                    .SetProperty(r => r.Revoked, token.Revoked)
                    .SetProperty(r => r.RevokedAt, token.RevokedAt)
                    .SetProperty(r => r.ReplacedByTokenHash, token.ReplacedByTokenHash)
                );
        }
    }
}
