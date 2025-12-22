using Backend.Entities;
using Backend.Service.IService;
using Backend.Service.Service;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

namespace Backend.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class AppointmentManageController : ControllerBase
    {
        private readonly IAppointmentManageService appointmentManageService;

        public AppointmentManageController(IAppointmentManageService appointmentManageService)
        {
            this.appointmentManageService = appointmentManageService;
        }

        [HttpGet]
        [Route("getAllByCondition")]
        [Authorize(Roles=("Manager")) ]
        public async Task<IActionResult> GetAllAppointmentsByCondition([FromQuery] string? status, [FromQuery] int? day , [FromQuery] int? month, [FromQuery] int? year, [FromQuery] int page)
        {
            var appointments = await appointmentManageService.GetAllAppointmentByCondition(status, day, month,year,page);
            return Ok(appointments);
        }

        [HttpGet]
        [Route("getDetailByAppointmentId")]
        //[Authorize(Roles = ("Manager"))]
        public async Task<IActionResult> GetAppointmentByAppointmentId([FromQuery] int appointmentId)
        {
            var appointment = await appointmentManageService.GetAppointmentByAppointmnetId(appointmentId);
            return Ok(appointment);
        }

        [HttpPut]
        [Route("updateStatus")]
        [Authorize(Roles = ("Manager"))]
        public async Task<IActionResult> AcceptOrRejectById([FromQuery]int id, [FromQuery]string status)
        {
            await appointmentManageService.AcceptOrRejectAsync(id, status);
            return NoContent();
        }
    }
}
