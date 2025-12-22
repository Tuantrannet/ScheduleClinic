using Backend.Repositories.Interface;
using Backend.Service.IService;

namespace Backend.Service.Service
{
    public class RefreshTokenCleanUpService : BackgroundService
    {
        private readonly IServiceScopeFactory serviceScopeFactory;

        public RefreshTokenCleanUpService(IServiceScopeFactory serviceScopeFactory)
        {
            this.serviceScopeFactory = serviceScopeFactory;
        }

        protected override async Task ExecuteAsync(CancellationToken cancellationToken)
        {
            while (!cancellationToken.IsCancellationRequested)
            {
                using var scope = serviceScopeFactory.CreateScope();

                var service = scope.ServiceProvider.GetRequiredService<IAuthenService>();

                await service.Clean_Up_RefreshToken();

                await Task.Delay(TimeSpan.FromHours(24), cancellationToken);
            }
        }

    }
    
} 