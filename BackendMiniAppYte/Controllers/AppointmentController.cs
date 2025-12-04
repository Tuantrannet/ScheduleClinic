using Backend.DTO;
using Backend.Enities;
using Backend.Service.IService;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

namespace Backend.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class AppointmentController : ControllerBase
    {
        private readonly IAppointmentService appointmentService;

        public AppointmentController(IAppointmentService appointmentService)
        {
            this.appointmentService = appointmentService;
        }

        [HttpPost]
        [Route("add")]
        public async Task<IActionResult> CreateAppointment([FromBody] RequestAppointment appointment)
        {
            await appointmentService.CreateAsync(appointment);
            return Ok(new {Message = "Đã tạo cuộc hẹn thành công" });
        }

        [HttpPut]
        [Route("update")]
        public async Task<IActionResult> UpdateAppointment([FromBody] RequestAppointment appointment)
        {
            var upAppointment = await appointmentService.UpdateAsync(appointment);
            return Ok(upAppointment);
        }

        [HttpDelete]
        [Route("delete")]
        public async Task<IActionResult> DeleteAppointment([FromQuery] int appointmentId)
        {
            await appointmentService.DeleteAsync(appointmentId);
            return NoContent();
        }

        [HttpGet]
        [Route("getAllByPatient")]
        public async Task<IActionResult> GetAllAppointmentsByPatientId([FromQuery]int patientId, [FromQuery] int page)
        {
            var  appointments = await appointmentService.GetListAppointmentByPatientId(patientId, page);
            return Ok(appointments);

        }   
    }
}
