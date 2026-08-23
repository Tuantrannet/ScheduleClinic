using Backend.DTO.Request;
using Backend.Enities;
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
            var appointment = await dataContext.Appointments.Include(x => x.PatientInformation)
                .FirstOrDefaultAsync(x => x.AppointmentId == Id);

            return appointment;
        }

        public async Task AddAppointmentAsync(Appointment appointment)
        {
            await dataContext.Appointments.AddAsync(appointment);

        }

        public async Task<bool> DeleteAppointmentAsync(int Id)
        {
            var affect = await dataContext.Appointments.Where(x => x.AppointmentId == Id).ExecuteDeleteAsync();
            return affect > 0;

        }

        public async Task<bool> UpdateAppointmentByIdAsync(int Id, Appointment appointment)
        {

            var affect = await dataContext.Appointments.Where(x => x.AppointmentId == Id).ExecuteUpdateAsync
                                (x => x.SetProperty(u => u.StatusId, appointment.StatusId)
                                        .SetProperty(u => u.Time_start, appointment.Time_start)
                                        .SetProperty(u => u.Time_end, appointment.Time_end)
                                );

            return affect > 0;
        }

        public async Task<bool> UpdateStatusByIdAsync(int Id, int statusId)
        {
            var affect = await dataContext.Appointments.Where(x => x.AppointmentId == Id)
                                .ExecuteUpdateAsync(x => x.SetProperty(u => u.StatusId, statusId));

            return affect > 0;
        }

        public IQueryable<Appointment> GetAllAppointments()
        {
            return dataContext.Appointments
                .Include(x => x.Status);
        }

        public async Task<bool> CheckExitInDayAsync(string patientId, DateTime registerDate)
        {
            var exist = await dataContext.Appointments
                                          .AnyAsync(x => x.Time_start.Date == registerDate.Date 
                                          && x.PatientId == patientId && (x.StatusId == 1 || x.StatusId == 2));
            return exist;
        }

        public async Task<bool> CheckCancel(string patientId, DateTime registerDate)
        {
            var check = await dataContext.Appointments
                                          .AnyAsync(x=> x.Time_start == registerDate && x.PatientId == patientId
                                          && (x.StatusId == 3 || x.StatusId == 4 || x.StatusId == 5));
            return check;
        }

        public async Task<List<Appointment>> GetAppointmentListByDateAsync(DateTime date)
        {
            var appointments = await dataContext.Appointments
                                         .Where(a =>
                                            a.Time_start >= date &&
                                            a.Time_start < date.AddDays(1))
                                         .ToListAsync();
            return appointments;
        }

        public async Task<List<Appointment>> GetAppointmentsById(string patientId, int page)
        {

            int skip = (page - 1) * 5;

            var query = dataContext.Appointments.Where(x => x.PatientId == patientId)
                .OrderByDescending(x => x.Time_start.Date);

            var appointmentList = await query.Skip(skip).Take(5).ToListAsync();
            return appointmentList;
        }

        public async Task<bool> CheckPendingStatusAsync(int id)
        {
            // Kiểm tra xem có cuộc hẹn với ID cụ thể và trạng thái là "Pending" hay không
            var isPending = await dataContext.Appointments
                                              .AnyAsync(x => x.AppointmentId == id 
                                              && x.StatusId == 1);
            return isPending;
        }

        public async Task<List<Appointment>> GetAppointmentsByFilter(
                string? zaloId,
                int page,
                int? statusId,
                DateTime? fromDate,
                DateTime? toDate,
                DateTime? Date)
        {
            var query = GetAllAppointments(); // IQueryable<Appointment>

            if (statusId.HasValue)
            {
                query = query.Where(x => x.StatusId == statusId);
            }

            if (fromDate.HasValue)
            {
                query = query.Where(x => x.Time_start >= fromDate.Value);
            }

            if (toDate.HasValue)
            {
                query = query.Where(x => x.Time_start <= toDate.Value);
            }

            if (Date.HasValue)
            {
                var day = Date.Value.Date;
                var nextDay = day.AddDays(1);

                query = query.Where(x =>
                    x.Time_start >= day &&
                    x.Time_start < nextDay
                );
            }

            if (!string.IsNullOrEmpty(zaloId))
            {
                query = query.Where(x => x.PatientId == zaloId);
            }

            int pageSize = 5;
            int skip = (page - 1) * pageSize;

            // ✅ CHỈ await Ở ĐÂY
            return await query
                .OrderByDescending(x => x.Time_start)
                .Skip(skip)
                .Take(pageSize)
                .ToListAsync();
        }

        public async Task<PatientInformation> GetPatientById(int id)
        {
            var result = await dataContext.Appointments
                .Include(a=> a.PatientInformation)
                .FirstOrDefaultAsync(a => a.AppointmentId == id);
            var patient = result?.PatientInformation;
            return patient!;
        }
    }
}
