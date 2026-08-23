using Backend.DTO.Request;
using Backend.Entities;
using Backend.Exceptions;
using Backend.Repositories.Interface;
using Backend.Service.IService;
using Microsoft.EntityFrameworkCore;

namespace Backend.Service.Service
{
    public class UserService : IUserService
    {
        public readonly IUserRepo _userRepo;
        public readonly IUnitOfWork _unitOfWork;
        public UserService(IUserRepo userRepo, IUnitOfWork unitOfWork)
        {
            _userRepo = userRepo;
            _unitOfWork = unitOfWork;
        }

        public async Task AddAsync(UserRequestDto user)
        {
            var passwordHash = BCrypt.Net.BCrypt.HashPassword(user.Password);
            var userEntity = new User
            {
                UserName = user.UserName,
                PasswordHash = passwordHash,
                RoleId = 2,
            };
            await _userRepo.AddAsync(userEntity);
            await _unitOfWork.SaveChanges();
        }

        public async Task<bool> IsExist(string userName)
        {
            return await _userRepo.CheckUserIsExist(userName);
        }

        public async Task<bool> LoginAsync(UserRequestDto user)
        {
            var valid = await IsExist(user.UserName);

            if (!valid) throw new NotFoundException("User not found");

            var existingUser = await _userRepo.GetByUserNameAsync(user.UserName);

            bool isPasswordValid = BCrypt.Net.BCrypt.Verify(user.Password, existingUser.PasswordHash);

            return isPasswordValid;
        }

        public async Task DeleteUser(int id)
        {
            var affect = await _userRepo.DeleteAsync(id);
            if (!affect)
            {
                throw new KeyNotFoundException("Not find to user");
            }

            await _unitOfWork.SaveChanges();
        }

        public async Task<List<User>> GetAllUsersAsync()
        {
            return await _userRepo.GetAllAsync().ToListAsync();
        }

        public async Task<User> GetByUserName(string userName)
        {
            var user = await _userRepo.GetByUserNameAsync(userName);
            if (user == null)
            {
                throw new NotFoundException("User not found");
            }
            return user;
        }

        public async Task UpdateActive(int id)
        {
            var user = await _userRepo.GetByIdAsync(id);
            if (user == null)
            {
                throw new NotFoundException("User not found");
            }
            user.IsActive = !user.IsActive;
            var affect = await _userRepo.UpdateAsync(user);
            if (!affect)
            {
                throw new Exception("Update user failed");
            }
            await _unitOfWork.SaveChanges();
        }

        public async Task UpdatePass(int id, string pass)
        {
            var user = await _userRepo.GetByIdAsync(id);
            if (user == null)
            {
                throw new NotFoundException("User not found");
            }
            var passwordHash = BCrypt.Net.BCrypt.HashPassword(pass);
            user.PasswordHash = passwordHash;
            var affect = await _userRepo.UpdateAsync(user);
            if (!affect)
            {
                throw new Exception("Update user failed");
            }
            await _unitOfWork.SaveChanges();
        }
    }
}
