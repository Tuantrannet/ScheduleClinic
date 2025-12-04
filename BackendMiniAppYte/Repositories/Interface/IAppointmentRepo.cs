using Backend.Enities;

namespace Backend.Repositories.Interface
{
    public interface IAppointmentRepo
    {
        Task<Appointment?> GetAppointmentByIdAsync(int Id);

        Task AddAppointmentAsync(Appointment appointment);
        Task<bool> UpdateAppointmentByIdAsync(int Id ,Appointment appointment);

        Task<bool> DeleteAppointmentAsync(int Id);

        IQueryable<Appointment> GetAllAppointmentAsync();

        Task SaveChanges();

        Task<bool> CheckExitInDayAsync(int patient, DateTimeOffset registerDate);

        Task<bool> UpdateStatusByIdAsync(int Id, string status);


    }
}
