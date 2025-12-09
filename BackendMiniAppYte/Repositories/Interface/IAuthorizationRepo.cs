namespace Backend.Repositories.Interface
{
    public interface IAuthorizationRepo
    {
        IQueryable<string> GetUserRoleAByUserIdAsync(int userId);

    }
}
