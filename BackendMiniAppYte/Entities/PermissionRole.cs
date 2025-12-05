namespace Backend.Entities
{
    public class PermissionRole
    {
        public int RoleId { get; set; }

        public Role Role { get; set; }

        public int PermmissionId { get; set; }

        public Permission Permission { get; set; }
    }
}
