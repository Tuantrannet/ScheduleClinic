using Backend.Enities;
using Backend.Entities;
using Microsoft.EntityFrameworkCore;

namespace Backend
{
    public class DataContext : DbContext
    {
        public DataContext(DbContextOptions<DataContext> options) : base(options) { }

        public DbSet<Appointment> Appointments { get; set; }

        public DbSet<PatientInformation> PatientInformations { get; set; }

        public DbSet<WorkingHour> WorkingHours { get; set; }

        public DbSet<User> Users { get; set; }

        public DbSet<Role> Roles { get; set; }

        public DbSet<UserRole> UserRoles { get; set; }

        public DbSet<Permission> Permissions { get; set; }

        public DbSet<PermissionRole> PermissionRoles { get; set; }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);

            modelBuilder.Entity<Appointment>()
                        .HasOne(a => a.PatientInformation)
                        .WithMany(p => p.Appointments)
                        .HasForeignKey(a => a.PatientId)
                        .OnDelete(DeleteBehavior.Restrict);
        }
    }

}
