using Backend.DTO.Request;
using Backend.DTO.Respond;
using Backend.Enities;

namespace Backend.Service.IService
{
    public interface IAppointmentService
    {
        Task CreateAsync(RequestAppointment newAppointment);

        Task UpdateConfirmedCancel(int Id);

        Task UpdateConfirmedWait(int Id);

        Task UpdateWait(int Id);

        Task UpdatePendingCancel(int Id);

        Task UpdateSelfCancel(int Id);

        Task UpdateConfirmPending(int Id);

        Task<List<AppointmentDto>> GetListAppointmentByFilter(AppointmentFilterRequest filter);

        Task<List<Appointment>> GetListAppointmentByDate(DateOnly date);

        Task<PatientInformation> GetPatientById(int id);







    }
}
