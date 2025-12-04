using Backend.Enities;
using Backend.Service.IService;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

namespace Backend.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class WorkingHourController : ControllerBase
    {
        private readonly IWorkingHourService workingHourService;

        public WorkingHourController(IWorkingHourService workingHourService)
        {
            this.workingHourService = workingHourService;
        }

        // GET: api/WorkingHour/{id}
        [HttpGet]
        public async Task<ActionResult<WorkingHour>> GetByIdAsync([FromQuery]int id)
        {
            var result = await workingHourService.GetByIdAsync(id);
            return Ok(result);
        }

        // GET: api/WorkingHour
        [HttpGet]
        public async Task<ActionResult<List<WorkingHour>>> GetListWorkingHour()
        {
            var list = await workingHourService.GetListWorkingHour();
            return Ok(list);
        }

        // POST: api/WorkingHour
        [HttpPost]
        public async Task<IActionResult> CreateAsync([FromBody] WorkingHour workingHour)
        {
            await workingHourService.CreateAsync(workingHour);
            return ;
        }

        // PUT: api/WorkingHour/{id}
        [HttpPut]
        public async Task<ActionResult<WorkingHour>> UpdateAsync([FromQuery]int Id, [FromBody] WorkingHour workingHour)
        {
            var updated = await workingHourService.UpdateAsync(workingHour);
            return Ok(updated);
        }

        // DELETE: api/WorkingHour/{id}
        [HttpDelete]
        public async Task<IActionResult> DeleteAsync([FromQuery]int id)
        {
            await workingHourService.DeleteAsync(id);
            return NoContent();
        }
    }
}
