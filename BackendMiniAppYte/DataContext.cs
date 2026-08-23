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

        public DbSet<Status> Statuses { get; set; }
        public DbSet<RefreshToken> RefreshTokens { get; set; }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);

            modelBuilder.Entity<Appointment>()
                        .HasOne(a => a.PatientInformation)
                        .WithMany(p => p.Appointments)
                        .HasForeignKey(a => a.PatientId)
                        .OnDelete(DeleteBehavior.Restrict);

            modelBuilder.Entity<User>()
                        .HasOne(u => u.Role)
                        .WithMany(r=> r.Users)
                        .HasForeignKey(u => u.RoleId)
                        .OnDelete(DeleteBehavior.Restrict);

            modelBuilder.Entity<RefreshToken>()
                .HasIndex(r => r.Token)
                .IsUnique();

            modelBuilder.Entity<Role>()
                .HasData(
                    new Role { RoleId = 1, RoleName = "Admin" },
                    new Role { RoleId = 2, RoleName = "Manager" },
                    new Role { RoleId = 3, RoleName = "Patient" }
                );

            modelBuilder.Entity<Appointment>()
            .HasOne(a => a.Status)
            .WithMany(s => s.Appointments)
            .HasForeignKey(a => a.StatusId);

            modelBuilder.Entity<Status>()
                .HasData(
                    new Status { Id = 1, Name = "Pending" },
                    new Status { Id = 2, Name = "Confirmed" },
                    new Status { Id = 3, Name = "SelfCancel" },
                    new Status { Id = 4, Name = "PendingCancel" },
                    new Status { Id = 5, Name = "ConfirmedCancel" },
                    new Status { Id = 6, Name = "Wait" }
                );



        }
    }

}
