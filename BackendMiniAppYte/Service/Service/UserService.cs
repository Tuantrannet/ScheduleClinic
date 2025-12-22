using Backend.Entities;
using Backend.Repositories.Interface;
using Backend.Service.IService;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;

namespace Backend.Service.Service
{
    public class UserService : IUserService
    {
        private readonly IUserRepo userRepo;
        private readonly IUnitOfWork unitOfWork;
        private readonly IUserRoleRepo userRoleRepo;

        public UserService(IUserRepo userRepo, IUnitOfWork unitOfWork, IUserRoleRepo userRoleRepo)
        {
            this.userRepo = userRepo;
            this.unitOfWork = unitOfWork;
            this.userRoleRepo = userRoleRepo;
        }

        public async Task<User?> GetUserByIdAsync(int id)
        {
            if (id <= 0)
                throw new ArgumentException("User ID must be greater than 0");

            return await userRepo.GetByIdAsync(id);
        }

        public async Task<User?> GetUserByUserNameAsync(string username)
        {
            if (string.IsNullOrEmpty(username))
                throw new ArgumentException("Username cannot be empty");

            return await userRepo.GetByUserNameAsync(username);
        }

        public async Task<List<User>> GetAllUsersAsync()
        {
            return await userRepo.GetAllAsync().ToListAsync();
        }

        public async Task<bool> UpdateUserAsync(User user)
        {
            if (user == null)
                throw new ArgumentNullException(nameof(user));

            if (user.UserId <= 0)
                throw new ArgumentException("User ID must be greater than 0");

            var result = await userRepo.UpdateAsync(user);
            if (result)
                await unitOfWork.SaveChanges();

            return result;
        }

        public async Task<bool> DeleteUserAsync(int id)
        {
            if (id <= 0)
                throw new ArgumentException("User ID must be greater than 0");

            try
            {
                await userRepo.DeleteAsync(id);
                await unitOfWork.SaveChanges();
                return true;
            }
            catch
            {
                return false;
            }
        }

        public async Task<bool> CheckUserExistsAsync(string userName)
        {
            if (string.IsNullOrEmpty(userName))
                throw new ArgumentException("Username cannot be empty");

            return await userRepo.CheckUserIsExist(userName);
        }

    }
}
