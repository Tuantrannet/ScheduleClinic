using AutoMapper;
using Backend.DTO.Request;
using Backend.DTO.Respond;
using Backend.Enities;
using Backend.Repositories.Interface;
using Backend.Service.IService;
using Microsoft.EntityFrameworkCore;
using System.Threading.Tasks;
using static System.Runtime.InteropServices.JavaScript.JSType;

namespace Backend.Service.Service
{
    public class AppointmentService : IAppointmentService
    {
        private readonly IAppointmentRepo appointmentRepository;
        private readonly IMapper mapper;
        private readonly IUnitOfWork unitOfWork;
        private readonly IBookingHubService _hubService;
        public AppointmentService(IAppointmentRepo appointmentRepository, IMapper mapper,
            IUnitOfWork unitOfWork, IBookingHubService hubService)
        {
            this.appointmentRepository = appointmentRepository;
            this.mapper = mapper;
            this.unitOfWork = unitOfWork;
            _hubService = hubService;
        }

        public async Task CreateAsync(RequestAppointment newAppointment)
        {
            var exist = await appointmentRepository.CheckExitInDayAsync(newAppointment.PatientId, newAppointment.Time_Start);

            if (exist)
            {
                throw new Exception("Đã có lịch đk trong ngày ko thể tiếp tục đk");
            }

            var addAppointment = new Appointment
            {
                PatientId = newAppointment.PatientId,
                Time_start = newAppointment.Time_Start,
                Time_end = newAppointment.Time_End,
                Status = "Pending"
            };

            await appointmentRepository.AddAppointmentAsync(addAppointment);

            await unitOfWork.SaveChanges();
            await _hubService.NotifySlotChanged(DateOnly.FromDateTime((newAppointment.Time_Start)));


        }

        public async Task<RequestAppointment> UpdateAsync(RequestAppointment requestAppointment)
        {

            var updateAppointment = new Appointment()
            {
                Time_start = requestAppointment.Time_Start,
                Status = "Pending",
            };
            var affect = await appointmentRepository.UpdateAppointmentByIdAsync(requestAppointment.AppoinmentId, updateAppointment);

            if(affect == false)
            {
                throw new KeyNotFoundException();
            }

            return requestAppointment;
        }


        //Xóa cuộc hẹn
        public async Task DeleteAsync(int Id)
        {
            var affect = await appointmentRepository.DeleteAppointmentAsync(Id);

            if (affect == false)
            {
                throw new KeyNotFoundException("Not find a record to delete");
            }
            
        }

        

        //Lấy chi tiết cuộc hẹn bằng AppointmentId 
        public async Task<AppointmentDto?> GetAppointmentByAppointmnetId(int Id)
        {
            var appointment = await appointmentRepository.GetAppointmentByIdAsync(Id);

            if(appointment == null)
            {
                throw new KeyNotFoundException("Not find data about appointment");
            }

            var appointmentDto = mapper.Map<AppointmentDto>(appointment);
            return appointmentDto;
        }

        //Cần sửa lại
        public async Task<List<AppointmentDto>> GetListAppointmentByPatientId(string patientId, int page)
        {
            int skip = (page - 1) * 5;
            var query = appointmentRepository.GetAllAppointmentAsync();

            query = query.Where(x => x.PatientId == patientId).OrderByDescending(x => x.Time_start.Date);

            var appointmentList = await query.Skip(skip).Take(5).ToListAsync();

            var appointmentsDto = mapper.Map<List<AppointmentDto>>(appointmentList);
            return appointmentsDto;
        }

        public async Task<List<Appointment>> GetListAppointmentByDate(DateOnly date)
        {
            var baseDate = date.ToDateTime(TimeOnly.MinValue);
            return await appointmentRepository.GetAppointmentListByDateAsync(baseDate);
        }
    }
}
