using AutoMapper;
using Backend.DTO.Request;
using Backend.DTO.Respond;
using Backend.Enities;
using Backend.Exceptions;
using Backend.Repositories.Interface;
using Backend.Service.IService;
using Microsoft.EntityFrameworkCore;
using System.Threading.Tasks;
using static System.Runtime.InteropServices.JavaScript.JSType;

namespace Backend.Service.Service
{
    public class AppointmentService : IAppointmentService
    {
        private readonly IAppointmentRepo _appointmentRepository;
        private readonly IMapper _mapper;
        private readonly IUnitOfWork _unitOfWork;
        private readonly IBookingHubService _hubService;
        private readonly IHttpContextAccessor _httpContextAccessor;
        public AppointmentService(IAppointmentRepo appointmentRepository, IMapper mapper,
            IUnitOfWork unitOfWork, IBookingHubService hubService, IHttpContextAccessor httpContextAccessor)
        {
            _appointmentRepository = appointmentRepository;
            _mapper = mapper;
            _unitOfWork = unitOfWork;
            _hubService = hubService;
            _httpContextAccessor = httpContextAccessor;
        }

        public async Task CreateAsync(RequestAppointment newAppointment)
        {
            var exist = await _appointmentRepository.CheckExitInDayAsync(newAppointment.PatientId, newAppointment.Time_Start);

            if (newAppointment.Time_Start < DateTime.Now)
            {
                throw new BadRequestException("Không thể đặt lịch trong quá khứ hoặc khung giờ đã qua.");
            }

            if (exist)
            {
                throw new BadRequestException("Đã có lịch đăng ký trong ngày ko thể tiếp tục đăng ký");
            }

            var check = await _appointmentRepository.CheckCancel(newAppointment.PatientId, newAppointment.Time_Start);
            if (check)
            {
                throw new BadRequestException("Bạn đã hủy lịch trong giờ này, hãy đặt giờ khác");
            }

            var addAppointment = new Appointment
            {
                PatientId = newAppointment.PatientId,
                Time_start = newAppointment.Time_Start,
                Time_end = newAppointment.Time_End,
                StatusId = 1
            };

            await _appointmentRepository.AddAppointmentAsync(addAppointment);

            await _unitOfWork.SaveChanges();
            await _hubService.NotifySlotChanged(DateOnly.FromDateTime((newAppointment.Time_Start)));
        }

        public async Task UpdateConfirmedCancel(int Id)
        {
            var appointmentToUpdate = await _appointmentRepository.GetAppointmentByIdAsync(Id);
            if (appointmentToUpdate == null)
            {
                throw new KeyNotFoundException("Không tìm thấy bản ghi để xác nhận");
            }
            if (appointmentToUpdate.StatusId != 6)
            {
                throw new BadRequestException("Chỉ được phép đồng ý yêu cầu hủy lịch ở trạng thái Wait");
            }
            var dateToNotify = DateOnly.FromDateTime(appointmentToUpdate.Time_start);
            var affect = await _appointmentRepository.UpdateStatusByIdAsync(Id, 5);
            if (affect == false)
            {
                throw new Exception("Lỗi trong quá trình sửa bản ghi.");
            }
            await _hubService.NotifySlotChanged(dateToNotify);
        }

        public async Task UpdateConfirmedWait(int Id)
        {
            var appointmentToUpdate = await _appointmentRepository.GetAppointmentByIdAsync(Id);
            if (appointmentToUpdate == null)
            {
                throw new KeyNotFoundException("Không tìm thấy bản ghi để xác nhận");
            }
            if (appointmentToUpdate.StatusId != 6)
            {
                throw new BadRequestException("Chỉ được phép từ chối yêu cầu hủy lịch ở trạng thái Wait");
            }
            var dateToNotify = DateOnly.FromDateTime(appointmentToUpdate.Time_start);
            var affect = await _appointmentRepository.UpdateStatusByIdAsync(Id, 2);
            if (affect == false)
            {
                throw new Exception("Lỗi trong quá trình sửa bản ghi.");
            }
            await _hubService.NotifySlotChanged(dateToNotify);
        }

        public async Task UpdateWait(int Id)
        {
            var appointmentToUpdate = await _appointmentRepository.GetAppointmentByIdAsync(Id);
            if (appointmentToUpdate == null)
            {
                throw new KeyNotFoundException("Không tìm thấy bản ghi để xác nhận");
            }
            if (appointmentToUpdate.StatusId != 2)
            {
                throw new BadRequestException("Chỉ được phép gửi yêu cầu hủy lịch ở trạng thái Confirmed");
            }
            var dateToNotify = DateOnly.FromDateTime(appointmentToUpdate.Time_start);
            var affect = await _appointmentRepository.UpdateStatusByIdAsync(Id, 6);
            if (affect == false)
            {
                throw new Exception("Lỗi trong quá trình sửa bản ghi.");
            }
            await _hubService.NotifySlotChanged(dateToNotify);
        }

        public async Task UpdateConfirmPending(int Id)
        {
            var appointmentToUpdate = await _appointmentRepository.GetAppointmentByIdAsync(Id);
            if (appointmentToUpdate == null)
            {
                throw new KeyNotFoundException("Không tìm thấy bản ghi để xác nhận");
            }
            if (appointmentToUpdate.StatusId != 1)
            {
                throw new BadRequestException("Chỉ được phép xác nhận lịch ở trạng thái Pending");
            }
            var dateToNotify = DateOnly.FromDateTime(appointmentToUpdate.Time_start);
            var affect = await _appointmentRepository.UpdateStatusByIdAsync(Id, 2);
            if (affect == false)
            {
                throw new Exception("Lỗi trong quá trình sửa bản ghi.");
            }
            await _hubService.NotifySlotChanged(dateToNotify);
        }

        public async Task UpdatePendingCancel(int Id)
        {
            var appointmentToUpdate = await _appointmentRepository.GetAppointmentByIdAsync(Id);
            if (appointmentToUpdate == null)
            {
                throw new KeyNotFoundException("Không tìm thấy bản ghi để hủy");
            }
            if (appointmentToUpdate.StatusId != 1)
            {
                throw new BadRequestException("Chỉ được phép hủy lịch ở trạng thái Pending");
            }
            var dateToNotify = DateOnly.FromDateTime(appointmentToUpdate.Time_start);
            var affect = await _appointmentRepository.UpdateStatusByIdAsync(Id, 4);
            if (affect == false)
            {
                throw new Exception("Lỗi trong quá trình sửa bản ghi.");
            }
            await _hubService.NotifySlotChanged(dateToNotify);
        }

        public async Task UpdateSelfCancel(int Id)
        {
            
            var appointmentToUpdate = await _appointmentRepository.GetAppointmentByIdAsync(Id);
            var zaloId = _httpContextAccessor.HttpContext?.Items["zalo_id"]?.ToString();
            var role = _httpContextAccessor.HttpContext?.Items["role"]?.ToString();

            if (zaloId != role)
            {
                if (appointmentToUpdate.PatientId != zaloId)
                    throw new ForbiddenException("Bạn không có quyền hủy lịch này");
            }

            if (appointmentToUpdate == null)
            {
                throw new KeyNotFoundException("Không tìm thấy bản ghi để hủy");
            }


            if (appointmentToUpdate.StatusId != 1)
            {
                throw new BadRequestException("Chỉ được phép hủy lịch ở trạng thái Pending");
            }

            var dateToNotify = DateOnly.FromDateTime(appointmentToUpdate.Time_start);

            var affect = await _appointmentRepository.UpdateStatusByIdAsync(Id, 3);

            if (affect == false)
            {
                throw new Exception("Lỗi trong quá trình sửa bản ghi.");
            }

            await _hubService.NotifySlotChanged(dateToNotify);
        }

        //public async Task<AppointmentDto?> GetAppointmentByAppointmnetId(int Id)
        //{
        //    var appointment = await _appointmentRepository.GetAppointmentByIdAsync(Id);

        //    if(appointment == null)
        //    {
        //        throw new KeyNotFoundException("Không thể tìm thấy dữ liệu lịch hẹn");
        //    }

        //    var appointmentDto = _mapper.Map<AppointmentDto>(appointment);
        //    return appointmentDto;
        //}

        public async Task<List<AppointmentDto>> GetListAppointmentByFilter(AppointmentFilterRequest filter)
        {
            if (filter.page < 1)
            {
                throw new BadRequestException("Số trang phải ít nhất bằng 1");
            } 

            if (filter.Date.HasValue && (filter.fromDate != null || filter.toDate != null))
            {
                throw new BadRequestException("Không thể lọc 1 ngày cùng với khoảng ngày");
            }

            if (filter.fromDate.HasValue ^ filter.toDate.HasValue)
            {
                throw new BadRequestException("phải nhập cả ngày bắt đầu và ngày kết thúc");
            }

            if (filter.fromDate.HasValue && filter.toDate.HasValue && filter.fromDate > filter.toDate)
            {
                throw new BadRequestException("Ngày kết thúc không thể bé hơn ngày bắt đầu");
            }

            var zaloId = _httpContextAccessor.HttpContext?.Items["zalo_id"]?.ToString();
            var role = _httpContextAccessor.HttpContext?.Items["role"]?.ToString();

            if (zaloId == role)
            {
                filter.zaloId = null;
            }

            DateTime? fromDate = filter.fromDate?.ToDateTime(TimeOnly.MinValue);
            DateTime? toDate = filter.toDate?.ToDateTime(TimeOnly.MaxValue);
            DateTime? date = filter.Date?.ToDateTime(TimeOnly.MinValue);

            var listappointment = await _appointmentRepository.GetAppointmentsByFilter(filter.zaloId, filter.page,
                filter.statusId, fromDate, toDate, date);
            var result = _mapper.Map<List<AppointmentDto>>(listappointment);


            //var reponse = mapper.Map<List<AppointmentHistoryDto>>(result);
            return result;
        }

        public async Task<List<Appointment>> GetListAppointmentByDate(DateOnly date)
        {
            var baseDate = date.ToDateTime(TimeOnly.MinValue);
            return await _appointmentRepository.GetAppointmentListByDateAsync(baseDate);
        }

        public async Task<PatientInformation> GetPatientById(int id)
        {
            if (id == null || id <= 0)
            {
                throw new BadRequestException("Invalid patient ID");
            }

            var patient = await _appointmentRepository.GetPatientById(id);

            if (patient == null)
            {
                throw new KeyNotFoundException("Patient not found");
            }
            return patient;
        }
    }
}
