using Azure.Core;
using Backend.DTO.Request;
using Backend.Enities;
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

        // --- 1. Tạo mới thông tin bệnh nhân (Create) ---
        // POST: api/PatientInformation
        [HttpPost]
        [Route("add")]
        public async Task<ActionResult> CreateInformation([FromBody]CreatePatientRequestDto request)
        {
            var zaloId = HttpContext.Items["zalo_id"]?.ToString();
            if (!HttpContext.Items.TryGetValue("zalo_id", out var zaloObj))
                return Unauthorized();

            await patientService.CreateAsync(request, zaloId);

            return Ok(new { message = "Cập nhật thông tin thành công" });
        }

        // --- 2. Lấy thông tin bệnh nhân theo Id (Read) ---
        // GET: api/PatientInformation/5
        [HttpGet]
        [Route("getDetail")]
        public async Task<ActionResult> GetInformationById([FromQuery]string id)
        {
            var zaloId = HttpContext.Items["zalo_id"]?.ToString();
            if (!HttpContext.Items.TryGetValue("zalo_id", out var zaloObj))
                return Unauthorized();
            var information = await patientService.GetInformationByIdAsync(id);
            return Ok(information);
        }

        // --- 3. Cập nhật thông tin bệnh nhân (Update) ---
        // PUT: api/PatientInformation/5
        [HttpPut]
        [Route("update")]
        public async Task<IActionResult> UpdateInformation([FromBody]CreatePatientRequestDto upInformation)
        {
            var zaloId = HttpContext.Items["zalo_id"]?.ToString();
            if (!HttpContext.Items.TryGetValue("zalo_id", out var zaloObj))
                return Unauthorized();
            var updatedInformation = await patientService.UpdateAsync(zaloId, upInformation);
            return  Ok(updatedInformation);
        }

        // --- 4. Xóa thông tin bệnh nhân (Delete) ---
        // DELETE: api/PatientInformation/5
        [HttpDelete]
        [Route("delete")]
        public async Task<IActionResult> DeleteInformation([FromQuery]string id)
        {

            await patientService.DeleteAsync(id);

            // Trả về mã 204 No Content báo hiệu xóa thành công
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
