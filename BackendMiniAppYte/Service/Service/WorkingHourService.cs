using Backend.Enities;
using Backend.Repositories.Interface;
using Backend.Service.IService;
using Microsoft.EntityFrameworkCore;

namespace Backend.Service.Service
{
    public class WorkingHourService : IWorkingHourService
    {
        private readonly IWorkingHourRepo workingHourRepo;

        public WorkingHourService(IWorkingHourRepo workingRepo)
        {
            this.workingHourRepo = workingRepo;
        }

        public async Task<WorkingHour> GetByIdAsync(int id)
        {
            var workingHour = await workingHourRepo.GetByIdAsync(id);

            if(workingHour == null)
            {
                throw new KeyNotFoundException("Not find data ");
            }

            return workingHour;
        }
        
        public async Task<List<WorkingHour>> GetListWorkingHour()
        {
            var query =  workingHourRepo.GetAllWorkingHour();

            return await query.ToListAsync();
        }

        public async Task CreateAsync(WorkingHour workingHour)
        {
            await workingHourRepo.AddAsync(workingHour);
            await workingHourRepo.SaveChanges();        
        }

        public async Task<WorkingHour> UpdateAsync(WorkingHour upWorking)
        {
            var affect = await workingHourRepo.UpdateAsync(upWorking.WorkingId, upWorking);
            if(affect== false)
            {
                throw new KeyNotFoundException("Not Find to update");
            }

            return upWorking;
        }

        public async Task DeleteAsync(int Id)
        {
            var affect = await workingHourRepo.DeleteAsync(Id);

            if (affect== false)
            {
                throw new KeyNotFoundException("Not find to update");
            }
        }


    }
}
