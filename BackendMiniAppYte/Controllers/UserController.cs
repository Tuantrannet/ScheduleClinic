using Backend.DTO.Request;
using Backend.Entities;
using Backend.Filters;
using Backend.Service.IService;
using Microsoft.AspNetCore.Mvc;

namespace Backend.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class UserController : ControllerBase
    {

        public readonly IUserService _userService;

        public UserController(IUserService userService)
        {
            _userService = userService;
        }

        [HttpGet("GetAll")]
        [ZaloAuthorizeRole("Admin")]
        public async Task<IActionResult> GetAllUsers()
        {
            var users = await _userService.GetAllUsersAsync();
            return Ok(users);
        }

        [HttpPost("Add")]
        [ZaloAuthorizeRole("Admin")]
        public async Task<IActionResult> AddAccount([FromBody] UserRequestDto user)
        {
            var exists = await _userService.IsExist(user.UserName);
            if (exists) return BadRequest();

            await _userService.AddAsync(user);

            return Ok(new { Message = "User added successfully." });
        }

        [HttpGet("CheckUserName")]
        public async Task<IActionResult> CheckUserName([FromQuery] string userName)
        {
            var exists = await _userService.IsExist(userName);
            return Ok(exists);
        }

        [HttpDelete("Delete")]
        [ZaloAuthorizeRole("Admin")]
        public async Task<IActionResult> DeleteUser([FromQuery] int id)
        {
            await _userService.DeleteUser(id);
            return Ok(new { Message = "Deleted user successfully." });
        }

        [HttpPatch("UpdateActive")]
        [ZaloAuthorizeRole("Admin")]
        public async Task<IActionResult> UpdateIsActive(int id)
        {
            await _userService.UpdateActive(id);
            return Ok(new { Message = "Updated active successfully." });
        }

        [HttpPatch("UpdatePassword")]
        [ZaloAuthorizeRole("Admin")]
        public async Task<IActionResult> UpdatePassword([FromQuery] int id,[FromBody] string password)
        {
            await _userService.UpdatePass(id, password);
            return Ok(new { Message = "Updated password successfully." });
        }
    }
}
