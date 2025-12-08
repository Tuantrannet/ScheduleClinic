using Backend.Entities;
using Backend.Repositories.Interface;
using Backend.Service.IService;
using Microsoft.EntityFrameworkCore.Metadata.Conventions;
using Microsoft.VisualBasic;

namespace Backend.Service.Service
{
    public class PermissionService : IPermissionService
    {
        private readonly IPermissionRepo permissionRepo;
        private readonly IPermissionRoleRepo permissionRoleRepo;

        public PermissionService(IPermissionRepo permmissionRepo, IPermissionRoleRepo permissionRoleRepo)
        {
            this.permissionRepo = permmissionRepo;
            this.permissionRoleRepo = permissionRoleRepo;
        }
        public async Task CreateAsync(Permission permission)
        {
            await permissionRepo.AddPermissionAsync(permission);
            await permissionRepo.SaveChanges();

        }

        public async Task UpdateAsync(Permission permission)
        {
            var affect = await permissionRepo.UpdatePermissionAsync(permission);

            if(affect ==false)
            {
                throw new KeyNotFoundException("Can't update this permission");
            }

            await permissionRepo.SaveChanges();
        }

        public async Task DeleteAsync(int Id)
        {
            var affect =  await permissionRepo.DeletePermissionAsync(Id);
            if (affect == false)
            {
                throw new KeyNotFoundException();
            }
            await permissionRepo.SaveChanges();
        }

        public async Task<List<Permission>> GetAllPermissionAsync()
        {
            var permisisons = await permissionRepo.GetAllAsync();
            return permisisons;
        }

        public async Task AssignPermissionToRoleAsync(int roleId, int permissionId)
        {
            var addPermisionRole = new PermissionRole()
            {
                RoleId = roleId,
                PermissionId = permissionId
            };
            await permissionRoleRepo.AddPermissionRoleAsync(addPermisionRole);
            await permissionRepo.SaveChanges();
        }

        public async Task RemovePermissionFromRoleAsync(int permissionId, int roleId)
        {
            await permissionRoleRepo.DeleteAsync(permissionId, roleId);

        }


    }
}
