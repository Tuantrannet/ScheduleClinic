using AutoMapper;
using Backend.DTO.Respond;
using Backend.Repositories.Interface;
using Backend.Service.IService;
using Microsoft.EntityFrameworkCore;

namespace Backend.Service.Service
{
    public class AppointmentManageService : IAppointmentManageService
    {
        private readonly IAppointmentRepo appointmentRepo;
        private readonly IMapper mapper;

        public AppointmentManageService(IAppointmentRepo appointmentRepo, IMapper mapper)
        {
            this.appointmentRepo = appointmentRepo;
            this.mapper = mapper;
        }

        //Lấy tất cả cuộc hẹn theo điều kiện
        public async Task<List<AppointmentDto>> GetAllAppointmentByCondition(string? status, DateTimeOffset? dateCondition, int page)
        {
            var query = appointmentRepo.GetAllAppointmentAsync();

            query = query.Where(x => x.AppointmentDate.Date == dateCondition);
            if (status != null)
            {
                query = query.Where(x => x.Status == status);
            }

            var appointmentList = await query.Skip((page - 1) * 5).Take(5).ToListAsync();
            if (appointmentList.Count == 0)
            {
                throw new KeyNotFoundException("Not find data with condition");
            }

            var appointmentsDto = mapper.Map<List<AppointmentDto>>(appointmentList);

            return appointmentsDto;
        }

        // Cập nhật trạng thái của lịch hẹn 
        public async Task UpdateStatusAsync(int Id, string status)
        {
            var affect = await appointmentRepo.UpdateStatusByIdAsync(Id, status);
            if (affect == false)
            {
                throw new KeyNotFoundException();
            }
        }

        public async Task<AppointmentDto?> GetAppointmentByAppointmnetId(int Id)
        {
            var appointment = await appointmentRepo.GetAppointmentByIdAsync(Id);

            if (appointment == null)
            {
                throw new KeyNotFoundException("Not find data about question");
            }

            var appointmentDto = mapper.Map<AppointmentDto>(appointment);
            return appointmentDto;
        }

    }
}
