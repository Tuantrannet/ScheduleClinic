using Backend.Enities;
using Microsoft.EntityFrameworkCore;

namespace Backend
{
    public class DataContext : DbContext
    {
        public DataContext(DbContextOptions<DataContext> options) : base(options) { }

        public DbSet<Appointment> Appointments { get; set; }

        public DbSet<PatientInformation> PatientInformations { get; set; }

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
