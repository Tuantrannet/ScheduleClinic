using Backend.Repositories.Interface;

namespace Backend.Repositories.Implement
{
    public class UnitOfWork : IUnitOfWork
    {
        private readonly DataContext dataContext;

        public UnitOfWork(DataContext dataContext)
        {
            this.dataContext = dataContext;
        }

        public async Task SaveChanges()
        {
            await dataContext.SaveChangesAsync();
        }
    }
}
