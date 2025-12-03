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
        public async Task<ActionResult<PatientInformation>> CreateInformation([FromBody]PatientInformation addInformation)
        {

            await patientService.CreateAsync(addInformation);

            return Ok();
        }

        // --- 2. Lấy thông tin bệnh nhân theo Id (Read) ---
        // GET: api/PatientInformation/5
        [HttpGet]
        [Route("getDetail")]
        public async Task<ActionResult<PatientInformation>> GetInformationById([FromQuery]int id)
        {
            var information = await patientService.GetInformationByIdAsync(id);
            return Ok(information);
        }

        // --- 3. Cập nhật thông tin bệnh nhân (Update) ---
        // PUT: api/PatientInformation/5
        [HttpPut]
        [Route("update")]
        public async Task<IActionResult> UpdateInformation([FromQuery]int id, [FromBody]PatientInformation upInformation)
        {
            var updatedInformation = await patientService.UpdateAsync(id, upInformation);
            return  Ok(updatedInformation);
        }

        // --- 4. Xóa thông tin bệnh nhân (Delete) ---
        // DELETE: api/PatientInformation/5
        [HttpDelete]
        [Route("delete")]
        public async Task<IActionResult> DeleteInformation([FromQuery]int id)
        {

            await patientService.DeleteAsync(id);

            // Trả về mã 204 No Content báo hiệu xóa thành công
            return NoContent();
        }
    }
}
