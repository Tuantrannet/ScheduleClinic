using Backend.Enities;
using Backend.Repositories.Interface;
using Microsoft.EntityFrameworkCore;
using System;
using System.Threading.Tasks;


namespace Backend.Repositories.Implement
{
    public class WorkingHourRepo : IWorkingHourRepo
    {
        private readonly DataContext dataContext;

        public WorkingHourRepo(DataContext dataContext)
        {
            this.dataContext = dataContext;
        }

        public async Task<WorkingHour?> GetByIdAsync(int id)
        {
            // Không cần .Include vì WorkingHour không có quan hệ phức tạp
            var workingHour =  await dataContext.WorkingHours.FirstOrDefaultAsync(w => w.WorkingId == id);
            return workingHour;
        }

        public async Task AddAsync(WorkingHour workingHour)
        {
            await dataContext.WorkingHours.AddAsync(workingHour);
        }

        public async Task<bool> UpdateAsync(int Id, WorkingHour workingHour)
        {
            var affect = await dataContext.WorkingHours
                                          .Where(x => x.WorkingId == Id)
                                          .ExecuteUpdateAsync(x => x
                                              .SetProperty(u => u.TimeStart, workingHour.TimeStart)
                                              .SetProperty(u => u.TimeEnd, workingHour.TimeEnd)
                                              .SetProperty(u => u.Duration, workingHour.Duration)
                                              .SetProperty(u=> u.Description , workingHour.Description));

            return affect > 0;
        }

        public async Task<bool> DeleteAsync(int Id)
        {
            var affect = await dataContext.WorkingHours
                                          .Where(x => x.WorkingId == Id)
                                          .ExecuteDeleteAsync();
            return affect > 0;
        }

        public async Task<bool> ExistsAsync(int id)
        {
            return await dataContext.WorkingHours.AnyAsync(e => e.WorkingId == id);
        }

        public IQueryable<WorkingHour> GetAllWorkingHour()
        {
            return dataContext.WorkingHours.AsQueryable();
        }

        /// <summary>
        /// Lưu các thay đổi đã được theo dõi vào Database (chỉ dùng cho AddAsync).
        /// </summary>
        public async Task SaveChanges()
        {
            await dataContext.SaveChangesAsync();
        }
    }
}
