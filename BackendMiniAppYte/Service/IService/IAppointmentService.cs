using Backend.DTO;
using Backend.DTO.Respond;
using Backend.Enities;

namespace Backend.Service.IService
{
    public interface IAppointmentService
    {
        Task CreateAsync(RequestAppointment newAppointment);

        Task<RequestAppointment> UpdateAsync(RequestAppointment requestAppointment);

        Task DeleteAsync(int Id);

        Task<List<AppointmentDto>> GetAllAppointmentByCondition(string? status, DateTimeOffset? dateCondition, int page);

        Task<AppointmentDto?> GetAppointmentByAppointmnetId(int Id);

        Task<List<AppointmentDto>> GetListAppointmentByPatientId(int patientId, int page);




    }
}
