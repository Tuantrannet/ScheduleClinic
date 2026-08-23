using Backend.Filters;
using Backend.Service.IService;
using Microsoft.AspNetCore.Mvc;

namespace Backend.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class SlotController : ControllerBase
    {
        private readonly ISlotService _slotService;
        private readonly IWorkingHourService _workingHourService;
        private readonly IAppointmentService _appointmentService;

        public SlotController(ISlotService slotService, IWorkingHourService workingHourService, IAppointmentService appointmentService)
        {
            _slotService = slotService;
            _workingHourService = workingHourService;
            _appointmentService = appointmentService;
        }

        [HttpGet]
        [Route("slots")]
        [ZaloIdAuthorize]
        public async Task<IActionResult> GetSlots(DateOnly date)
        {
            var wh = await _workingHourService.GetByIdAsync(1);

            var appointment = await _appointmentService.GetListAppointmentByDate(date);

            var slots = _slotService.GenerateSlots(date, wh, appointment);
            return Ok(slots);
        }
    }
}
