using Backend.DTO.Model;
using Backend.DTO.Respond;
using Backend.Entities;
using Backend.Repositories.Interface;
using Backend.Service.IService;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc.TagHelpers;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Options;
using Microsoft.IdentityModel.Tokens;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Security.Cryptography;
using System.Text;

namespace Backend.Service.Service
{
    public class AuthenService : IAuthenService
    {
        private readonly IUserRepo userRepo;
        private readonly PasswordHasher<User> passwordHasher;
        private readonly IUnitOfWork unitOfWork;
        private readonly IAuthorizationRepo authorizationRepo;
        private readonly IRefreshTokenRepo refreshTokenRepo;
        private readonly JwtSettings options;

        public AuthenService(IUserRepo userRepo, PasswordHasher<User> passwordHasher,
            IUnitOfWork unitOfWork, IAuthorizationRepo authorizationRepo,
            IRefreshTokenRepo refreshTokenRepo, IOptions<JwtSettings> options)
        {
            this.userRepo = userRepo;
            this.passwordHasher = passwordHasher;
            this.unitOfWork = unitOfWork;
            this.authorizationRepo = authorizationRepo;
            this.refreshTokenRepo = refreshTokenRepo;
            this.options = options.Value;
        }

        public async Task Register_User(UserDto user)
        {
            var existUser = await userRepo.CheckUserIsExist(user.UserName);
            if (existUser == true)
            {
                throw new ArgumentException("UserName already exists");
            }

            var newUser = new User()
            {
                UserName = user.UserName,
                IsActive = true
            };

            newUser.PasswordHash = passwordHasher.HashPassword(newUser, user.Password);

            await userRepo.AddAsync(newUser);

            await unitOfWork.SaveChanges();

        }

        public async Task<AuthResult> Login(string userName, string password)
        {
            var user = await userRepo.GetByUserNameAsync(userName);

            if (user == null)
            {
                throw new KeyNotFoundException("Not find this userName");
            }

            var result = passwordHasher.VerifyHashedPassword(user, user.PasswordHash, password);

            if (result == PasswordVerificationResult.Failed)
            {
                throw new ArgumentException("Failed to login");
            }

            // Generate access token
            var accessToken = await Generate_JwtToken(user);
            var accessExpiresAt = DateTime.UtcNow.AddMinutes(options.AccessTokenExpirationMinutes);

            // Generate refresh token (plaintext to return, hashed to store)
            var refreshTokenPlain = Generate_RandomToken();
            var refreshTokenHash = ComputeSha256Hash(refreshTokenPlain);

            var refreshEntity = new RefreshToken
            {
                UserId = user.UserId,
                TokenHash = refreshTokenHash,
                ExpiresAt = DateTime.UtcNow.AddDays(options.RefreshTokenExpirationDays),
                CreatedAt = DateTime.UtcNow,
                Revoked = false
            };

            await refreshTokenRepo.AddAsync(refreshEntity);
            await unitOfWork.SaveChanges();

            return new AuthResult
            {
                AccessToken = accessToken,
                RefreshToken = refreshTokenPlain,
            };
        }

        public async Task<User?> Get_By_Id_Async(int Id)
        {
            var user = await userRepo.GetUserByIdAsync(Id);
            return user;
        }

        private async Task<string> Generate_JwtToken(User user)
        {
            if (string.IsNullOrEmpty(options.Key))
                throw new InvalidOperationException("JWT secret is not configured.");

            var key = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(options.Key));
            var creds = new SigningCredentials(key, SecurityAlgorithms.HmacSha256);

            var claims = new List<Claim>()
            {
                new Claim(JwtRegisteredClaimNames.Jti, Guid.NewGuid().ToString()),
                new Claim(JwtRegisteredClaimNames.Sub, user.UserId.ToString())

            };

            var roles = await authorizationRepo.GetUserRoleAByUserIdAsync(user.UserId).ToListAsync();

            if (roles != null)
            {
                foreach (var code in roles)
                {
                    claims.Add(new Claim("Role", code));
                }
            }

            var token = new JwtSecurityToken
                (
                issuer: options.Issuer,
                audience: options.Audience,
                claims: claims,
                expires: DateTime.UtcNow.AddMinutes(options.AccessTokenExpirationMinutes),
                signingCredentials: creds
                );

            return new JwtSecurityTokenHandler().WriteToken(token);

        }

        private static string Generate_RandomToken(int size = 64)
        {
            var bytes = RandomNumberGenerator.GetBytes(size);
            return Convert.ToBase64String(bytes);
        }

        private static string ComputeSha256Hash(string rawData)
        {
            using var sha = SHA256.Create();
            var bytes = Encoding.UTF8.GetBytes(rawData);
            var hash = sha.ComputeHash(bytes);
            return Convert.ToBase64String(hash);
        }

        private static void  Validate_Token(RefreshToken token)
        {
            if(token == null)
            {
                throw new SecurityTokenException("Invalid RT");
            }

            if(token.Revoked == true)
            {
                throw new SecurityTokenException("RT revoked");
            }

            if(token.ExpiresAt < DateTime.UtcNow)
            {
                throw new SecurityTokenException("RT expired");
            }

            if(token.ReplacedByTokenHash != null)
            {
                throw new SecurityTokenException("RT already used");
            }
        }

        private async Task Revoke_RefreshToken(int id ,string RT2)
        {
            var affect = await refreshTokenRepo.Update_RevokeRT_ByToken(id, RT2);
            if(affect == false)
            {
                throw new ArgumentException("Chua the thu hoi Token");
            }
        }

        public async Task<AuthResult> Refresh_RT_And_AT(string refreshToken)
        {
            var tokenHash = ComputeSha256Hash(refreshToken);
            var storedToken = await refreshTokenRepo.GetByHashAsync(tokenHash);
            if(storedToken == null)
            {
                throw new KeyNotFoundException("Not find this RT");
            }

            Validate_Token(storedToken);

            // Generate new refreshtoken
            var newToken = Generate_RandomToken();
            var newTokenHash = ComputeSha256Hash(newToken);

            await Revoke_RefreshToken(storedToken.Id, newTokenHash);

            var newRefreshToken = new RefreshToken
            {
                UserId = storedToken.UserId,
                TokenHash = newTokenHash,
                ExpiresAt = DateTime.UtcNow.AddDays(options.RefreshTokenExpirationDays),
                CreatedAt = DateTime.UtcNow,
            };
            
            await refreshTokenRepo.AddAsync(newRefreshToken);
            await unitOfWork.SaveChanges();

            //Generate new accessToken
            var user = await userRepo.GetUserByIdAsync(storedToken.UserId);
            if(user == null)
            {
                throw new KeyNotFoundException("Not find this userId");
            }
            var accessToken = await Generate_JwtToken(user);

            var authResult = new AuthResult
            {
                AccessToken = accessToken,
                RefreshToken = newToken,
            };

            return authResult;
        }

        public async Task Clean_Up_RefreshToken()
        {
            await refreshTokenRepo.Delete_RefreshToken();
        }

        
    }
}
