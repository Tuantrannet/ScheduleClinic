using Backend.DTO.Request;
using Backend.Entities;
using Backend.Repositories.Interface;
using Backend.Service.IService;
using Microsoft.AspNetCore.Identity;
using Microsoft.VisualBasic;

namespace Backend.Service.Service
{
    public class UserService : IUserService
    {
        private readonly IUserRepo userRepo;
        private readonly PasswordHasher<User> passwordHasher;

        public UserService(IUserRepo userRepo, PasswordHasher<User> passwordHasher)
        {
            this.userRepo = userRepo;
            this.passwordHasher = passwordHasher;
        }

        public async Task RegisterUser(UserDto user)
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

            await userRepo.SaveChanges();

        }

        public async Task Login(string userName,string password)
        {
            var user = await userRepo.GetByUserNameAsync(userName);

            if (user == null)
            {
                throw new KeyNotFoundException("Not find this userName");
            }

            var result = passwordHasher.VerifyHashedPassword(user,user.PasswordHash,password);

            if (result == PasswordVerificationResult.Failed)
            {
                throw new ArgumentException("Failed to login");
            }else if (result == PasswordVerificationResult.Success)
            {

            }

        }

        public async Task<User?> GetByIdAsync(int Id)
        {
            var user = await userRepo.GetByIdAsync(Id);
            return user;
        }
    }
}
