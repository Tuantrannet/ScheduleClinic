using System.ComponentModel.DataAnnotations;

namespace Backend.Entities
{
    public class User
    {
        [Key]
        public int UserId { get; set; }
        public int RoleId { get; set; }

        [Required]
        public string UserName { get; set; }
        
        public string PasswordHash { get; set; }

        public bool IsActive { get; set; } = true;
        public Role Role { get; set; }

    }
}
