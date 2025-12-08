using Backend.Entities;
using Backend.Repositories.Implement;

namespace Backend.Service.IService
{
    public interface IPermissionService
    {
        Task CreateAsync(Permission permission);

        Task UpdateAsync(Permission permission);

        Task DeleteAsync(int id);

        Task<List<Permission>> GetAllPermissionAsync();

        Task AssignPermissionToRoleAsync(int roleId, int permissionId);

        Task RemovePermissionFromRoleAsync(int permissionId, int roleId);
    }

}
