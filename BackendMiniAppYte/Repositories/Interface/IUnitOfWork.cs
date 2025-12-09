namespace Backend.Repositories.Interface
{
    public interface IUnitOfWork
    {
        Task SaveChanges();
    }
}
