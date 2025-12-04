namespace Backend.Entities
{
    public class PermissionRole
    {
        public int PermissionRoleId { get; set; }

        public int RoleId { get; set; }

        public Role Role { get; set; }
    }
}
