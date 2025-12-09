using AutoMapper;
using Backend.DTO.Request;
using Backend.DTO.Respond;
using Backend.Enities;
using Backend.Repositories.Interface;
using Backend.Service.IService;
using Microsoft.EntityFrameworkCore;
using System.Threading.Tasks;

namespace Backend.Service.Service
{
    public class AppointmentService : IAppointmentService
    {
        private readonly IAppointmentRepo appointmentRepository;
        private readonly IMapper mapper;
        private readonly IUnitOfWork unitOfWork;
        public AppointmentService(IAppointmentRepo appointmentRepository, IMapper mapper, IUnitOfWork unitOfWork)
        {
            this.appointmentRepository = appointmentRepository;
            this.mapper = mapper;
            this.unitOfWork = unitOfWork;
        }

        //Tạo cuộc hẹn 
        public async Task CreateAsync(RequestAppointment newAppointment)
        {
            var exist = await appointmentRepository.CheckExitInDayAsync(newAppointment.PatientId, newAppointment.AppointmentDate);

            if (exist)
            {
                throw new Exception("Đã có lịch đk trong ngày ko thể tiếp tục đk");
            }

            var addAppointment = new Appointment
            {
                PatientId = newAppointment.PatientId,
                AppointmentDate = newAppointment.AppointmentDate,
                Status = "Pending"
            };

            await appointmentRepository.AddAppointmentAsync(addAppointment);

            await unitOfWork.SaveChanges();

            
        }

        //Cập nhật cuộc hẹn
        public async Task<RequestAppointment> UpdateAsync(RequestAppointment requestAppointment)
        {

            var updateAppointment = new Appointment()
            {
                AppointmentDate = requestAppointment.AppointmentDate,
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

        //Lấy List cuộc hẹn của Patient
        public async Task<List<AppointmentDto>> GetListAppointmentByPatientId(int patientId, int page)
        {
            int skip = (page - 1) * 5;
            var query = appointmentRepository.GetAllAppointmentAsync();

            query = query.Where(x => x.PatientId == patientId).OrderByDescending(x => x.AppointmentDate.Date);

            var appointmentList = await query.Skip(skip).Take(5).ToListAsync();

            var appointmentsDto = mapper.Map<List<AppointmentDto>>(appointmentList);
            return appointmentsDto;
        }

        //Lấy list cuộc hẹn của 

    }
}
