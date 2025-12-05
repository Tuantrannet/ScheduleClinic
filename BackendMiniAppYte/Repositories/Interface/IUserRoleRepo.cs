using Backend.Entities;

namespace Backend.Repositories.Interface
{
    public interface IUserRoleRepo
    {
        Task AddUserRoleAsync(UserRole userRole);

        Task<bool> DeleteUserRoleAsync(UserRole userRole);

        IQueryable<UserRole> UserRoleTableByUserId(int id);

        Task<bool> CheckExistRoleAsync(int userId,int roleId);
    }
}
