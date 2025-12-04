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
        public async Task<IActionResult> CreateAsync([FromBody]WorkingHour workingHour)
        {
            await workingHourService.CreateAsync(workingHour);
            return NoContent() ;
        }

        // PUT: api/WorkingHour/{id}
        [HttpPut]
        [Route("update")]
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
    }
}
