using Backend.Entities;

namespace Backend.Repositories.Interface
{
    public interface IAppointmentRepo
    {
        Task<Appointment?> GetAppointmentByIdAsync(int Id);

        Task AddAppointmentAsync(Appointment appointment);
        Task<bool> UpdateAppointmentByIdAsync(int Id ,Appointment appointment);

        Task<bool> DeleteAppointmentAsync(int Id);

        IQueryable<Appointment> GetAllAppointmentAsync();


        Task<bool> CheckExitInDayAsync(string patientId, DateOnly registerDate);

        Task<bool> UpdateStatusByIdAsync(int Id, string status);

        Task<List<Appointment>> Get_Appointment_By_Date(DateOnly dateCondition, TimeOnly startTime, TimeOnly endTime);

    }
}
