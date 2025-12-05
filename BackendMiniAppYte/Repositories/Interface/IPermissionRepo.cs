using Backend.Entities;

namespace Backend.Repositories.Interface
{
    public interface IPermissionRepo
    {
        Task<List<Permission>> GetAllAsync();

        Task<Permission?> GetByIdAsync(int Id);
        Task AddPermissionAsync(Permission permission);

        Task<bool> UpdatePermissionAsync(Permission permission);

        Task<bool> DeletePermissionAsync(int permissionId);

        //Loading
        IQueryable<Permission> PermissionTable();


    }
}
