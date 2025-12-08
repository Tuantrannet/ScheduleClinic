using Backend.Entities;

namespace Backend.Repositories.Interface
{
    public interface IPermissionRoleRepo
    {
        Task AddPermissionRoleAsync(PermissionRole permissionRole);

        Task<bool> DeleteAsync(int permissionId, int roleId);

        Task<bool> ExistAsync(int roleId, int permissionId);

        IQueryable<PermissionRole> PermissionRolesTableByRoleId(IEnumerable<int> roleIds);

        IQueryable<PermissionRole> PermissionRolesTable();
    }
}
