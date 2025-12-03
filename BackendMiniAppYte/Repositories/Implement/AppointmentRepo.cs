using Backend.Enities;
using Backend.Repositories.Interface;
using Microsoft.EntityFrameworkCore;

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
                                );

            return affect > 0;
        }

        public IQueryable<Appointment> GetAllAppointmentAsync()
        {
            return dataContext.Appointments.AsQueryable();

        }

        public async Task SaveChanges()
        {
            await dataContext.SaveChangesAsync();
        }

        public async Task<bool> CheckExitInDayAsync(int patientId, DateTimeOffset registerDate)
        {
            var exist = await dataContext.Appointments
                                            .AnyAsync(x => x.AppointmentDate.Date == registerDate.Date && x.PatientId == patientId);
            return exist;
        }
    }
}
