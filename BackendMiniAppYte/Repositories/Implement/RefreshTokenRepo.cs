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

        //RT1,2 : refreshToken 1,2
        public async Task<bool> Update_RevokeRT_ByToken(int id, string RT2)
        {
            var affect = await dataContext.RefreshTokens
                                .Where(x => x.Id == id)
                                .ExecuteUpdateAsync( s => s
                                    .SetProperty(r => r.Revoked ,true)
                                    .SetProperty(r=>r.RevokedAt,DateTime.UtcNow)
                                    .SetProperty(r=> r.ReplacedByTokenHash , RT2)
                                );
            return affect>0 ;
        }

        public async Task Delete_RefreshToken()
        {
            var gracePeriod = TimeSpan.FromDays(15);
            var cutOffTime = DateTime.UtcNow.Subtract(gracePeriod);
            var deleteToken = dataContext.RefreshTokens.
                    Where(x => x.ExpiresAt < DateTime.UtcNow
                    || (x.Revoked == true && x.RevokedAt.HasValue && x.RevokedAt.Value < cutOffTime));

            await deleteToken.ExecuteDeleteAsync();
        }
    }
}
