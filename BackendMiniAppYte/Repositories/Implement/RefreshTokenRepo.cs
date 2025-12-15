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

        public async Task<RefreshToken?> GetByTokenAsync(string token)
        {
            return await dataContext.RefreshTokens.FirstOrDefaultAsync(t => t.Token == token);
        }

        public async Task<bool> UpdateAsync(RefreshToken refreshToken)
        {
            var affect = await dataContext.RefreshTokens
                .Where(x=> x.Id == refreshToken.Id)
                .ExecuteUpdateAsync(s => s
                    .SetProperty(t => t.Token, refreshToken.Token)
                    .SetProperty(t => t.ExpiresAt, refreshToken.ExpiresAt)
                    .SetProperty(t => t.CreatedAt, refreshToken.CreatedAt)
                );
            return affect>0;


        }
    }
}
