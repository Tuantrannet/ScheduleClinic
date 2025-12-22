using Backend.Entities;
using Backend.Repositories.Interface;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Conventions;

namespace Backend.Repositories.Implement
{
    public class AppointmentRepo : IAppointmentRepo
    {
        private readonly DataContext dataContext;

        public AppointmentRepo(DataContext dataContext)
        {
            this.dataContext = dataContext;
        }

        public async Task<Appointment?> GetAppointmentByIdAsync(int Id)
        {
            var appointment = await dataContext.Appointments.Include(x=> x.PatientInformation).FirstOrDefaultAsync(x => x.AppointmentId == Id);

            return appointment;
        }

        public async Task AddAppointmentAsync(Appointment appointment)
        {
            await dataContext.Appointments.AddAsync(appointment);

        }

        public async Task<bool> DeleteAppointmentAsync(int Id)
        {
            var affect = await dataContext.Appointments.Where(x => x.AppointmentId == Id).ExecuteDeleteAsync();
            return affect>0 ;

        } 

        public async Task<bool> UpdateAppointmentByIdAsync(int Id, Appointment appointment)
        {
            var affect = await dataContext.Appointments.Where(x => x.AppointmentId == Id).ExecuteUpdateAsync
                                (x => x.SetProperty(u=> u.Status,appointment.Status)
                                        .SetProperty(u => u.AppointmentDate, appointment.AppointmentDate)
                                        .SetProperty(u => u.Start_Time,appointment.Start_Time)
                                        .SetProperty(u => u.End_Time, appointment.End_Time)
                                );

            return affect > 0;
        }

        public async Task<bool> UpdateStatusByIdAsync(int Id, string status)
        {
            var affect = await dataContext.Appointments.Where(x => x.AppointmentId == Id)
                                .ExecuteUpdateAsync(x => x.SetProperty(u => u.Status, status));

            return affect > 0;
        }
                
        public IQueryable<Appointment> GetAllAppointmentAsync()
        {
            return dataContext.Appointments.AsQueryable().AsNoTracking();

        }

        

        public async Task<bool> CheckExitInDayAsync(string patientId, DateOnly registerDate)
        {
            var exist = await dataContext.Appointments
                                            .AnyAsync(x => x.AppointmentDate == registerDate && x.PatientId == patientId);
            return exist;
        }

        public async Task<List<Appointment>>  Get_Appointment_By_Date(DateOnly dateCondition, TimeOnly startTime,TimeOnly endTime)
        {
            var appointment = await dataContext.Appointments
                                    .Where(x => x.AppointmentDate == dateCondition 
                                    && (startTime <= x.Start_Time && x.Start_Time<= endTime)
                                    && (x.Status == "Pending" || x.Status == "Accept"))
                                    .OrderBy(x=> x.Start_Time)
                                    .AsNoTracking()
                                    .ToListAsync();
            return appointment;

        }
    }
}
