using Backend.DTO.Request;
using Backend.DTO.Respond;
using Backend.Service.IService;
using Microsoft.AspNetCore.Mvc;

namespace Backend.Controllers
{
    [Route("api/[controller]")]
    [ApiController] 
    public class AuthController : ControllerBase
    {
        private readonly IAccessTokenService _accessTokenService;
        private readonly IRefreshTokenService _refreshTokenService;
        private readonly IPatientInformationService _patientInformationService;

        public AuthController(IRefreshTokenService refreshTokenService, IAccessTokenService accessTokenService, IPatientInformationService patientInformationService)
        {
            this._refreshTokenService = refreshTokenService;
            this._accessTokenService = accessTokenService;
            _patientInformationService = patientInformationService;
        }

        [HttpPost("checkexist")]
        public async Task<IActionResult> CheckExist([FromQuery] string zaloId)
        {
            var check = await _patientInformationService.CheckZaloIdAsync(zaloId);
            if (string.IsNullOrEmpty(zaloId))
            {
                return BadRequest(new { Message = "ZaloId is required." });
            }

            var access = _accessTokenService.GenerateAccessToken(zaloId);

            var refresh = await _refreshTokenService.CreateRefreshTokenAsync(zaloId);

            return Ok(new CheckReponseDto
            {
                AccessToken = access,
                RefreshToken = refresh.Token,
                exists = check
            });
        }

        [HttpPost("refresh")]
        public async Task<IActionResult> Refresh([FromBody] RefreshRequestDto request)
        {
            // 1. Check Refresh Token input
            if (string.IsNullOrEmpty(request.RefreshToken))
            {
                return BadRequest(new { Message = "Refresh token is required." });
            }

            // 2. Check Refresh Token trong DB
            var existing = await _refreshTokenService.GetByTokenAsync(request.RefreshToken);
            if (existing == null)
            {
                // Token không tồn tại hoặc đã bị thu hồi
                return Unauthorized(new { Message = "Invalid refresh token." });
            }
            if (existing.ExpiresAt < DateTime.UtcNow)
            {
                // Token hết hạn sử dụng (30 ngày)
                return Unauthorized(new { Message = "Refresh token has expired." });
            }

            // 3. Lấy Access Token cũ từ Header
            string authHeader = Request.Headers["Authorization"];
            string oldAccessToken = authHeader?.Replace("Bearer ", "");

            // 4. Lấy ZaloId từ Access Token cũ
            var zaloId = _accessTokenService.GetPrincipalFromExpiredToken(oldAccessToken);

            // [FIX QUAN TRỌNG]: Nếu không lấy được zaloId (do token giả mạo hoặc sai key), phải chặn lại
            if (string.IsNullOrEmpty(zaloId))
            {
                return Unauthorized(new { Message = "Invalid access token." });
            }

            // 5. Xoay vòng Refresh Token (Revoke cái cũ, tạo cái mới)
            var rotated = await _refreshTokenService.RotateRefreshTokenAsync(existing);

            // 6. Tạo Access Token mới
            var access = _accessTokenService.GenerateAccessToken(zaloId);

            return Ok(new RefreshReponseDto
            {
                access_token = access,
                refresh_token = rotated.Token
            });
        }




    }
}
