using Microsoft.OpenApi.Writers;
using System.ComponentModel.DataAnnotations;
using System.Runtime.Serialization;

namespace Backend.Entities
{
    public class UserRole
    {
        [Key]
        public int UserRoleId { get; set; }

        public int RoleId { get; set; }

        public int UserId { get; set; }

        public User User { get; set; }

        public Role Role { get; set; }


    }
}
