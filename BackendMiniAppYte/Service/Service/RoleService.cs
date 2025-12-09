using Backend.Entities;
using Backend.Repositories.Interface;
using Backend.Service.IService;

namespace Backend.Service.Service
{
    public class RoleService : IRoleService
    {
        private readonly IRoleRepo roleRepo;
        private readonly IUserRoleRepo userRoleRepo;
        private readonly IUnitOfWork unitOfWork;


        public RoleService(IRoleRepo roleRepo, IUserRoleRepo userRoleRepo
            ,IUnitOfWork unitOfWork)
        {
            this.roleRepo = roleRepo;
            this.userRoleRepo = userRoleRepo;
            this.unitOfWork = unitOfWork;
        }

        public async Task CreateRoleAsync(Role role)
        {
            await roleRepo.AddRoleAsync(role);
            await unitOfWork.SaveChanges();
        }

        public async Task DeleteRoleAsync(int Id)
        {
            await roleRepo.DeleteRoleAsync(Id);
        }

        public async Task UpdateRoleAsync(Role role)
        {
            await roleRepo.UpdateRoleAsync(role);
        }

        public async Task<List<Role>> GetAllRoleAsync()
        {
             return await roleRepo.GetAllAsync();
        }

        // Gan role cho user
        public async Task AssignRoleAsync(int userId, int roleId)
        {
            var addUserRole = new UserRole()
            {
                UserId = userId,
                RoleId = roleId
            };
            await userRoleRepo.AddUserRoleAsync(addUserRole);
            await unitOfWork.SaveChanges();
        }

        // remove khoi role
        public async Task RemoveRoleAsync(int userId , int roleId)
        {
            var removeUserRole = new UserRole()
            {
                UserId = userId,
                RoleId = roleId
            };

            var affect = await userRoleRepo.DeleteUserRoleAsync(removeUserRole);
            if(affect == false)
            {
                throw new ArgumentException("Khong the xoa duoc ");
            }
        }

    }
}
