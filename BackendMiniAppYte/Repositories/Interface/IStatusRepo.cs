using Backend.Entities;

namespace Backend.Repositories.Interface
{
    public interface IStatusRepo
    {
        Task<List<Status>> GetAllStatus();
    }
}
