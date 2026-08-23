using Backend.DTO.Model;

namespace Backend.Service.IService
{
    public interface IAccessTokenService
    {
        string GenerateAccessToken(string zaloId, string role);
        TokenPrincipalInfo? GetPrincipalFromExpiredToken(string? token);
    }
}
