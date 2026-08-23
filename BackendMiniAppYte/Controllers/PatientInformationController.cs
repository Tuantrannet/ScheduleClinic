using Backend.DTO.Request;
using Backend.Enities;
using Backend.Filters;
using Backend.Service.IService;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

namespace Backend.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class PatientInformationController : ControllerBase
    {
        private readonly IPatientInformationService patientService;


        public PatientInformationController(IPatientInformationService patientService)
        {
            this.patientService = patientService;
        }


        [HttpPost]
        [Route("add")]
        [ZaloIdAuthorize]
        public async Task<ActionResult> CreateInformation([FromBody]CreatePatientRequestDto request)
        {
            var zaloId = HttpContext.Items["zalo_id"]?.ToString();
            await patientService.CreateAsync(request, zaloId);

            return Ok(new { message = "Cập nhật thông tin thành công" });
        }


        [HttpGet]
        [Route("getDetail")]
        [ZaloIdAuthorize]
        public async Task<ActionResult> GetInformationById([FromQuery]string id)
        {
            var information = await patientService.GetInformationByIdAsync(id);
            return Ok(information);
        }


        [HttpPut]
        [Route("update")]
        [ZaloIdAuthorize]
        public async Task<IActionResult> UpdateInformation([FromBody]CreatePatientRequestDto upInformation)
        {
            var zaloId = HttpContext.Items["zalo_id"]?.ToString();
            var updatedInformation = await patientService.UpdateAsync(zaloId, upInformation);
            return  Ok(updatedInformation);
        }

        [HttpDelete]
        [Route("delete")]
        [ZaloIdAuthorize]
        public async Task<IActionResult> DeleteInformation([FromQuery]string id)
        {
            await patientService.DeleteAsync(id);

            return NoContent();
        }
        [HttpGet]
        [Route("check")]
        public async Task<IActionResult> CheckZaloIdExist([FromQuery] string id)
        {
            var information = await patientService.CheckZaloIdAsync(id);
            return Ok(information != null);
        }
    }
}
