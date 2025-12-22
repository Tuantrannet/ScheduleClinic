using Backend.Entities;
using Backend.Entities;
using Backend.Repositories.Interface;
using Backend.Service.IService;
using Microsoft.EntityFrameworkCore;

namespace Backend.Service.Service
{
    public class WorkingHourService : IWorkingHourService
    {
        private readonly IWorkingHourRepo workingHourRepo;
        private readonly IUnitOfWork unitOfWork;

        public WorkingHourService(IWorkingHourRepo workingRepo, IUnitOfWork unitOfWork)
        {
            this.workingHourRepo = workingRepo;
            this.unitOfWork = unitOfWork;
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
            ValidateWorkingHour(workingHour);
            await workingHourRepo.AddAsync(workingHour);

            //var timeMorDifference = workingHour.Mor_End - workingHour.Mor_Start;
            //var timeAffDifference = workingHour.Aff_End - workingHour.Aff_Start;

            //int numberOfMorDuration = (int)(timeMorDifference.TotalMinutes / workingHour.Duration);
            //int numberOfAffDuration = (int)(timeAffDifference.TotalMinutes / workingHour.Duration);

            //for(int i=0; i< numberOfMorDuration; i++)
            //{
            //    var bookingTime = new BookingTime(workingHour.Mor_Start.AddMinutes(workingHour.Duration * i),workingHour.Duration);
            //    await workingHourRepo.Add_BookingTime(bookingTime);

            //}

            //for(int i=0; i< numberOfAffDuration; i++)
            //{
            //    var bookingTime = new BookingTime(workingHour.Aff_Start.AddMinutes(workingHour.Duration * i), workingHour.Duration);
            //    await workingHourRepo.Add_BookingTime(bookingTime);
            //}


            await unitOfWork.SaveChanges();        
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

        
        private static void ValidateWorkingHour(WorkingHour workingHour)
        {
            if(workingHour.Duration < 0)
            {
                throw new ArgumentException("Duration < 0");
            }

            if(workingHour.Mor_End < workingHour.Mor_Start)
            {
                throw new ArgumentException("Mor_Start > Mor_End ");
            }

            if (workingHour.Aff_End < workingHour.Aff_Start)
            {
                throw new ArgumentException("Mor_Start > Mor_End ");
            }

            if(workingHour.Aff_Start < workingHour.Mor_End)
            {
                throw new ArgumentException("Mor_end > Aff_Start");
            }
        }
    }
}
