namespace Backend.Service.IService
{
    public interface IAccessTokenService
    {
        string GenerateAccessToken(string zaloId);
        string GetPrincipalFromExpiredToken(string? token);
    }
}
