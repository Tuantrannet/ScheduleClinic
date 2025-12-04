using Backend.DTO.Respond;

namespace Backend.Service.IService
{
    public interface IAppointmentManageService
    {
        Task<List<AppointmentDto>> GetAllAppointmentByCondition(string? status, DateTimeOffset? dateCondition, int page);
        Task UpdateStatusAsync(int Id, string status);

        Task<AppointmentDto?> GetAppointmentByAppointmnetId(int Id);
    }
}
