using Backend.DTO.Model;
using Backend.Service.IService;
using Microsoft.Extensions.Options;
using Microsoft.IdentityModel.Tokens;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;

namespace Backend.Service.Service
{
    public class AccessTokenService : IAccessTokenService
    {
        private readonly JwtSettings _settings;

        public AccessTokenService(IOptions<JwtSettings> opts)
        {
            _settings = opts.Value;
        }

        public string GenerateAccessToken(string zaloId)
        {
            var key = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(_settings.SecretKey));
            var creds = new SigningCredentials(key, SecurityAlgorithms.HmacSha256);

            var claims = new[]
            {
                new Claim("zalo_id", zaloId)
            };

            var token = new JwtSecurityToken(
                issuer: _settings.Issuer,
                audience: _settings.Audience,
                claims: claims,
                expires: DateTime.UtcNow.AddMinutes(_settings.AccessTokenExpirationMinutes),
                signingCredentials: creds
            );

            return new JwtSecurityTokenHandler().WriteToken(token);
        }


        public string GetPrincipalFromExpiredToken(string? token)
        {
            if (string.IsNullOrEmpty(token)) return null;

            var tokenValidationParameters = new TokenValidationParameters
            {
                ValidateAudience = true,
                ValidateIssuer = true,
                ValidateIssuerSigningKey = true,
                // [FIX QUAN TRỌNG]: Sử dụng _settings.SecretKey thay vì chuỗi cứng
                IssuerSigningKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(_settings.SecretKey)),
                ValidIssuer = _settings.Issuer,
                ValidAudience = _settings.Audience,
                ValidateLifetime = false // Bỏ qua lỗi hết hạn
            };

            var tokenHandler = new JwtSecurityTokenHandler();
            try
            {
                var principal = tokenHandler.ValidateToken(token, tokenValidationParameters, out SecurityToken securityToken);

                if (!(securityToken is JwtSecurityToken jwtSecurityToken) ||
                    !jwtSecurityToken.Header.Alg.Equals(SecurityAlgorithms.HmacSha256, StringComparison.InvariantCultureIgnoreCase))
                {
                    throw new SecurityTokenException("Invalid token");
                }

                return principal.Claims.FirstOrDefault(c => c.Type == "zalo_id")?.Value;
            }
            catch (Exception ex)
            {
                // Bạn có thể log error tại đây để debug dễ hơn
                Console.WriteLine("Token validation failed: " + ex.Message);
                return null;
            }
        }
    }
}
