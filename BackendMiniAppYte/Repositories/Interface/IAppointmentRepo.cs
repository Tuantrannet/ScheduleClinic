using Backend.Enities;

namespace Backend.Repositories.Interface
{
    public interface IAppointmentRepo
    {
        Task<Appointment?> GetAppointmentByIdAsync(int Id);

        Task AddAppointmentAsync(Appointment appointment);
        //Task<bool> UpdateAppointmentByIdAsync(int Id, Appointment appointment);

        Task<bool> DeleteAppointmentAsync(int Id);

        IQueryable<Appointment> GetAllAppointments();

        Task<bool> CheckCancel(string patientId, DateTime registerDate);

        Task<bool> CheckExitInDayAsync(string patient, DateTime registerDate);

        Task<bool> UpdateStatusByIdAsync(int Id, int statusId);

        Task<List<Appointment>> GetAppointmentListByDateAsync(DateTime date);

        Task<List<Appointment>> GetAppointmentsById(string patientId, int page);

        Task<bool> CheckPendingStatusAsync(int id);

        Task<List<Appointment>> GetAppointmentsByFilter(
                string? zaloId,
                int page,
                int? statusId,
                DateTime? fromDate,
                DateTime? toDate,
                DateTime? Date);

        Task<PatientInformation> GetPatientById(int id);
    }

        
}
