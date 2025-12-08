using Backend.Entities;

namespace Backend.Repositories.Interface
{
    public interface IRoleRepo
    {
        Task<Role?> GetByIdAsync(int id);

        Task<List<Role>> GetAllAsync();

        Task AddRoleAsync(Role role);

        Task<bool> DeleteRoleAsync(int id);

        Task<bool> UpdateRoleAsync(Role role);

        IQueryable<Role> RolesTable();

        Task SaveChanges();
    }
}
