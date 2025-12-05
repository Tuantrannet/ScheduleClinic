using System.ComponentModel.DataAnnotations;

namespace Backend.Entities
{
    public class Permission
    {
        [Key]
        public int PermissionId { get; set; }

        public string CodeName { get; set; } // 

        public string GroupName { get; set; } // Quan ly chuc nang

        public ICollection<PermissionRole>  PermissionRoles { get; set; } = new List<PermissionRole>();

    }
}
