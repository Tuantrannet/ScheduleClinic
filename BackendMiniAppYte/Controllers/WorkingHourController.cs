using Backend.Entities;
using Backend.Service.IService;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

namespace Backend.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class WorkingHourController : ControllerBase
    {
        private readonly IWorkingHourService workingHourService;
        private readonly ISlotService slotService;

        public WorkingHourController(IWorkingHourService workingHourService, ISlotService slotService)
        {
            this.workingHourService = workingHourService;
            this.slotService = slotService;
        }

        // GET: api/WorkingHour/{id}
        [HttpGet]
        [Route("getDetail")]

        public async Task<ActionResult> GetByIdAsync([FromQuery]int id)
        {
            var result = await workingHourService.GetByIdAsync(id);
            return Ok(result);
        }

        // GET: api/WorkingHour
        [HttpGet]
        [Route("getAll")]
        public async Task<ActionResult> GetListWorkingHour()
        {
            var list = await workingHourService.GetListWorkingHour();
            return Ok(list);
        }

        // POST: api/WorkingHour
        [HttpPost]
        [Route("add")]
        //[Authorize(Roles = ("Manager"))]
        public async Task<IActionResult> CreateAsync([FromBody]WorkingHour workingHour)
        {
            await workingHourService.CreateAsync(workingHour);
            return NoContent() ;
        }

        // PUT: api/WorkingHour/{id}
        [HttpPut]
        [Route("update")]
        [Authorize(Roles = ("Manager"))]
        public async Task<ActionResult> UpdateAsync([FromBody] WorkingHour workingHour)
        {
            var updated = await workingHourService.UpdateAsync(workingHour);
            return Ok(updated);
        }

        // DELETE: api/WorkingHour/{id}
        [HttpDelete]
        [Route("delete")]
        public async Task<IActionResult> DeleteAsync([FromQuery]int id)
        {
            await workingHourService.DeleteAsync(id);
            return NoContent();
        }

        [HttpGet]
        [Route("getSlots")]
        public async Task<IActionResult> Get_Slot_From_Day([FromQuery]DateOnly dateCondition)
        {
            var slots = await slotService.Get_Slot_From_Day(dateCondition);
            return Ok(slots);
        }
    }
}
