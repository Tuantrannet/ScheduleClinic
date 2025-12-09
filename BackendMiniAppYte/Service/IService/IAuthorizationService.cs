namespace Backend.Service.IService
{
    public interface IAuthorizationService
    {
        Task<bool> CheckUserHasRoleAsync(int userId, string roleName);

        Task<IEnumerable<string>> GetUserRolesAsync(int userId);
    }
}
