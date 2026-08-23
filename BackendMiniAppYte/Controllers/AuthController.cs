using Backend.DTO.Request;
using Backend.DTO.Respond;
using Backend.Service.IService;
using Backend.Service.Service;
using Microsoft.AspNetCore.Mvc;
using Microsoft.IdentityModel.Tokens;

namespace Backend.Controllers
{
    [Route("api/[controller]")]
    [ApiController] 
    public class AuthController : ControllerBase
    {
        private readonly IAccessTokenService _accessTokenService;
        private readonly IRefreshTokenService _refreshTokenService;
        private readonly IPatientInformationService _patientInformationService;
        public readonly IUserService _userService;


        public AuthController(IRefreshTokenService refreshTokenService, 
            IAccessTokenService accessTokenService, 
            IPatientInformationService patientInformationService,
            IUserService userService)
        {
            _refreshTokenService = refreshTokenService;
            _accessTokenService = accessTokenService;
            _patientInformationService = patientInformationService;
            _userService = userService;
        }

        [HttpPost("checkexist")]
        public async Task<IActionResult> CheckExist([FromQuery] string zaloId)
        {
            var check = await _patientInformationService.CheckZaloIdAsync(zaloId);
            if (string.IsNullOrEmpty(zaloId))
            {
                return BadRequest(new { Message = "ZaloId is required." });
            }
            var roleName = "Patient";

            var access = _accessTokenService.GenerateAccessToken(zaloId, roleName);

            var refresh = await _refreshTokenService.CreateRefreshTokenAsync();

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
            if (string.IsNullOrEmpty(request.RefreshToken))
            {
                return BadRequest(new { Message = "Refresh token is required." });
            }

            var existing = await _refreshTokenService.GetByTokenAsync(request.RefreshToken);
            if (existing == null)
            {
                return Unauthorized(new { Message = "Invalid refresh token." });
            }
            if (existing.ExpiresAt < DateTime.UtcNow)
            {
                return Unauthorized(new { Message = "Refresh token has expired." });
            }

            string authHeader = Request.Headers["Authorization"];
            string oldAccessToken = authHeader?.Replace("Bearer ", "");

            var tokenInfo = _accessTokenService.GetPrincipalFromExpiredToken(oldAccessToken);

            if (tokenInfo == null)
            {
                return Unauthorized(new { Message = "Invalid access token." });
            }

            var rotated = await _refreshTokenService.RotateRefreshTokenAsync(existing);

            var access = _accessTokenService.GenerateAccessToken(tokenInfo.ZaloId, tokenInfo.Role);

            return Ok(new RefreshReponseDto
            {
                access_token = access,
                refresh_token = rotated.Token
            });
        }

        [HttpPost("login")]
        public async Task<IActionResult> Login([FromBody] UserRequestDto userRequestDto)
        {
            var isValid = await _userService.LoginAsync(userRequestDto);
            if (!isValid)
            {
                return Unauthorized(new { Message = "Invalid username or password." });
            }
            var user = await _userService.GetByUserName(userRequestDto.UserName);

            if (user.IsActive == false)
            {
                return Unauthorized(new { Message = "User account is inactive." });
            }

            var access = _accessTokenService.GenerateAccessToken(user.Role.RoleName, user.Role.RoleName);

            var refresh = await _refreshTokenService.CreateRefreshTokenAsync();

            return Ok(new CheckReponseDto
            {
                AccessToken = access,
                RefreshToken = refresh.Token,
                exists = isValid
            });
        }




    }
}
