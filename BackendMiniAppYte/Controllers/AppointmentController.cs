using AutoMapper;
using Backend.DTO.Request;
using Backend.DTO.Respond;
using Backend.Enities;
using Backend.Filters;
using Backend.Service.IService;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

namespace Backend.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class AppointmentController : ControllerBase
    {
        private readonly IAppointmentService _appointmentService;
        private readonly IMapper _mapper;

        public AppointmentController(IAppointmentService appointmentService, IMapper mapper)
        {
            _appointmentService = appointmentService;
            _mapper = mapper;
        }

        [HttpPost]
        [Route("add")]
        [ZaloIdAuthorize]
        public async Task<IActionResult> CreateAppointment([FromBody] RequestAppointment appointment)
        {
            await _appointmentService.CreateAsync(appointment);
            return Ok(new {Message = "Đã tạo cuộc hẹn thành công" });
        }

        [HttpPatch]
        [Route("updateConfirmedCancel")]
        [ZaloAuthorizeRole("Manager")]
        public async Task<IActionResult> UpdateConfirmedCancel([FromQuery] int appointmentId)
        {
            await _appointmentService.UpdateConfirmedCancel(appointmentId);
            return NoContent();
        }

        [HttpPatch]
        [Route("updateConfirmedWait")]
        [ZaloAuthorizeRole("Manager")]
        public async Task<IActionResult> UpdateConfirmedWait([FromQuery] int appointmentId)
        {
            await _appointmentService.UpdateConfirmedWait(appointmentId);
            return NoContent();
        }

        [HttpPatch]
        [Route("updateWait")]
        [ZaloIdAuthorize]
        public async Task<IActionResult> UpdateWait([FromQuery] int appointmentId)
        {
            await _appointmentService.UpdateWait(appointmentId);
            return NoContent();
        }

        [HttpPatch]
        [Route("updateConfirmPending")]
        [ZaloAuthorizeRole("Manager")]
        public async Task<IActionResult> UpdateConfirmPending([FromQuery] int appointmentId)
        {
            await _appointmentService.UpdateConfirmPending(appointmentId);
            return NoContent();
        }

        [HttpPatch]
        [Route("updatePendingCancel")]
        [ZaloAuthorizeRole("Manager")]
        public async Task<IActionResult> UpdatePendingCancel([FromQuery] int appointmentId)
        {
            await _appointmentService.UpdatePendingCancel(appointmentId);
            return NoContent();
        }

        [HttpPatch]
        [Route("updateSelfCancel")]
        [ZaloIdAuthorize]
        public async Task<IActionResult> UpdateSelfCancel([FromQuery] int appointmentId)
        {
            await _appointmentService.UpdateSelfCancel(appointmentId);
            return NoContent();
        }

        //[HttpDelete]
        //[Route("delete")]
        //[ZaloIdAuthorize]
        //public async Task<IActionResult> DeleteAppointment([FromQuery] int appointmentId)
        //{
        //    await _appointmentService.DeleteAsync(appointmentId);
        //    return NoContent();
        //}

        [HttpGet]
        [Route("getAllByFilter")]
        [ZaloIdAuthorize]
        public async Task<IActionResult> GetAllAppointmentsByFilter([FromQuery] AppointmentFilterRequest filter)
        {
            var  appointments = await _appointmentService.GetListAppointmentByFilter(filter);
            return Ok(appointments);
        }

        [HttpGet]
        [Route("getPatientById")]
        [ZaloAuthorizeRole("Manager")]
        public async Task<IActionResult> GetPatientById([FromQuery] int appointmentId)
        {
            var appointment = await _appointmentService.GetPatientById(appointmentId);
            PatientInfoDto result = _mapper.Map<PatientInfoDto>(appointment);
            return Ok(result);
        }


    }
}
