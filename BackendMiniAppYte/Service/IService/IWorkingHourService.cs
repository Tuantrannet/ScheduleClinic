using Backend.Enities;

namespace Backend.Service.IService
{
    public interface IWorkingHourService
    {
        Task<WorkingHour> GetByIdAsync(int id);

        Task<List<WorkingHour>> GetListWorkingHour();

        Task CreateAsync(WorkingHour workingHour);

        Task<WorkingHour> UpdateAsync(WorkingHour upWorking);

        Task DeleteAsync(int Id);
    }
}
