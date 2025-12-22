using Backend.DTO.Request;
using Backend.Entities;
using Backend.Service.IService;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using System.Runtime.CompilerServices;

namespace Backend.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class ManagerUserController : ControllerBase
    {
        private readonly IUserService userService;
        private readonly IRoleService roleService;

        public ManagerUserController(IUserService userService, IRoleService roleService)
        {
            this.userService = userService;
            this.roleService = roleService;
        }


        [HttpGet]
        [Route("getById")]
        //[Authorize(Roles = "Admin")]
        public async Task<IActionResult> GetUserById([FromQuery] int id)
        {
            if (id <= 0)
                return BadRequest(new { error = "Invalid user ID" });

            try
            {
                var user = await userService.GetUserByIdAsync(id);
                if (user == null)
                    return NotFound(new { error = "User not found" });

                return Ok(user);
            }
            catch (ArgumentException ex)
            {
                return BadRequest(new { error = ex.Message });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { error = "Internal server error", detail = ex.Message });
            }
        }

        [HttpGet]
        [Route("getByUsername")]
        //[Authorize(Roles = "Admin")]
        public async Task<IActionResult> GetUserByUserName([FromQuery] string username)
        {
            if (string.IsNullOrEmpty(username))
                return BadRequest(new { error = "Username cannot be empty" });

            try
            {
                var user = await userService.GetUserByUserNameAsync(username);
                if (user == null)
                    return NotFound(new { error = "User not found" });

                return Ok(user);
            }
            catch (ArgumentException ex)
            {
                return BadRequest(new { error = ex.Message });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { error = "Internal server error", detail = ex.Message });
            }
        }

        [HttpGet]
        [Route("getAll")]
        [Authorize(Roles = "Admin")]
        public async Task<IActionResult> GetAllUsers()
        {
            try
            {
                var users = await userService.GetAllUsersAsync();
                return Ok(users);
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { error = "Internal server error", detail = ex.Message });
            }
        }

        [HttpPut]
        [Route("update")]
        //[Authorize(Roles = "Admin")]
        public async Task<IActionResult> UpdateUser([FromQuery] int id, [FromBody] User user)
        {
            if (id <= 0)
                return BadRequest(new { error = "Invalid user ID" });

            if (!ModelState.IsValid)
                return BadRequest(ModelState);

            if (user == null || user.UserId != id)
                return BadRequest(new { error = "User ID mismatch" });

            try
            {
                var result = await userService.UpdateUserAsync(user);
                if (!result)
                    return NotFound(new { error = "User not found or update failed" });

                return Ok(new { message = "User updated successfully" });
            }
            catch (ArgumentException ex)
            {
                return BadRequest(new { error = ex.Message });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { error = "Internal server error", detail = ex.Message });
            }
        }

        [HttpDelete]
        [Route("delete")]
        //[Authorize(Roles = "Admin")]
        public async Task<IActionResult> DeleteUser([FromQuery] int id)
        {
            if (id <= 0)
                return BadRequest(new { error = "Invalid user ID" });

            try
            {
                var result = await userService.DeleteUserAsync(id);
                if (!result)
                    return NotFound(new { error = "User not found or deletion failed" });

                return Ok(new { message = "User deleted successfully" });
            }
            catch (ArgumentException ex)
            {
                return BadRequest(new { error = ex.Message });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { error = "Internal server error", detail = ex.Message });
            }
        }

        [HttpGet("check-exists/{username}")]
        public async Task<IActionResult> CheckUserExists([FromRoute] string username)
        {
            if (string.IsNullOrEmpty(username))
                return BadRequest(new { error = "Username cannot be empty" });

            try
            {
                var exists = await userService.CheckUserExistsAsync(username);
                return Ok(new { exists = exists });
            }
            catch (ArgumentException ex)
            {
                return BadRequest(new { error = ex.Message });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { error = "Internal server error", detail = ex.Message });
            }
        }

        [HttpPost]
        [Route("assignRole")]
        public async Task<IActionResult> AssignRoleToUser([FromBody] AssignRoleRequest request)
        {
            await roleService.AssignRoleAsync(request.UserId, request.RoleId);
            return NoContent();
        }

        [HttpDelete]
        [Route("removeRole")]
        public async Task<IActionResult> Remove_Role_From_User([FromQuery]int userId, [FromQuery]int roleId)
        {
            await roleService.RemoveRoleAsync(userId, roleId);
            return NoContent();
        }
    }
}