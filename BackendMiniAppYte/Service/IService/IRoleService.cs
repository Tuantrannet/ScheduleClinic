using Backend.Entities;

namespace Backend.Service.IService
{
    public interface IRoleService
    {
        Task CreateRoleAsync(Role role);

        Task DeleteRoleAsync(int Id);

        Task UpdateRoleAsync (Role role);

        Task<List<Role>> GetAllRoleAsync();

        Task AssignRoleAsync(int userId, int roleId);

        Task RemoveRoleAsync(int userId, int roleId);
    }
}
