using Backend.Enities;

namespace Backend.Repositories.Interface
{
    public interface IWorkingHourRepo
    {
        Task AddAsync(WorkingHour workingHour);
        Task<WorkingHour?> GetByIdAsync(int id);
        Task<bool> UpdateAsync(int Id, WorkingHour workingHour);
        Task<bool> DeleteAsync(int Id);

        IQueryable<WorkingHour> GetAllWorkingHour();

    }
}
