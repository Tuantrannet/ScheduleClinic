using Backend.Filters;
using Backend.Service.IService;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

namespace Backend.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class StatusController : ControllerBase
    {
        private readonly IStatusService _statusService;

        public StatusController(IStatusService statusService)
        {
            _statusService = statusService;
        }
        [HttpGet]
        [Route("getAll")]
        [ZaloIdAuthorize]
        public async Task<IActionResult> GetStatuses()
        {
            var statuses = await _statusService.GetStatuses();
            return Ok(statuses);
        }
    }
}
