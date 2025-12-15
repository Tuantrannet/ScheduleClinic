using Backend.DTO.Model;
using Microsoft.Extensions.Options;
using Microsoft.IdentityModel.Tokens;
using System.IdentityModel.Tokens.Jwt;
using System.Text;

namespace Backend.MiddleWare
{
    public class JwtMiddleware
    {
        private readonly RequestDelegate _next;
        private readonly JwtSettings _settings;

        public JwtMiddleware(RequestDelegate next, IOptions<JwtSettings> opts)
        {
            _next = next;
            _settings = opts.Value;
        }

        public async Task Invoke(HttpContext context)
        {
            var authHeader = context.Request.Headers["Authorization"].FirstOrDefault();
            var token = authHeader?.Replace("Bearer ", "");

            if (!string.IsNullOrEmpty(token))
            {
                try
                {
                    var tokenHandler = new JwtSecurityTokenHandler();
                    var key = Encoding.UTF8.GetBytes(_settings.SecretKey);

                    tokenHandler.ValidateToken(token, new TokenValidationParameters
                    {
                        ValidateIssuer = true,
                        ValidateAudience = true,
                        ValidateLifetime = true,
                        ValidateIssuerSigningKey = true,
                        ValidIssuer = _settings.Issuer,
                        ValidAudience = _settings.Audience,
                        IssuerSigningKey = new SymmetricSecurityKey(key),
                        ClockSkew = System.TimeSpan.Zero
                    }, out SecurityToken validatedToken);

                    var jwtToken = (JwtSecurityToken)validatedToken;
                    var zaloId = jwtToken.Claims.FirstOrDefault(c => c.Type == "zalo_id")?.Value;
                    if (!string.IsNullOrEmpty(zaloId))
                    {
                        context.Items["zalo_id"] = zaloId;
                    }
                }
                catch
                {
                    // invalid token => ignore, endpoint can return Unauthorized
                }
            }

            await _next(context);
        }
    }
}
