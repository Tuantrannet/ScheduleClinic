using Backend.DTO.Respond;

namespace Backend.Service.IService
{
    public interface IAppointmentManageService
    {
        Task<List<AppointmentDto>> GetAllAppointmentByCondition(string? status, int? day, int? month, int? year, int page);
        Task AcceptOrRejectAsync(int Id, string status);

        Task<AppointmentDto?> GetAppointmentByAppointmnetId(int Id);
    }
}
