using Microsoft.EntityFrameworkCore.Metadata.Conventions;
using System.ComponentModel.DataAnnotations;

namespace Backend.Entities
{
    public class PatientInformation
    {
        [Key]
        public string PatientId { get; set; } = null!;


        [Required(ErrorMessage = "Tên là bắt buộc.")]
        [StringLength(100)]
        public string PatientName { get; set; }

        [StringLength(10)]
        public string? Gender { get; set; }  // "Male", "Female", "Other"

        public string? Birthday { get; set; }

        [Phone(ErrorMessage = "Số điện thoại không hợp lệ.")]
        [StringLength(10)]
        public string PhoneNumber { get; set; } = null!;

        public string CCCD { get; set; }

        public ICollection<Appointment> Appointments { get; set; } = new List<Appointment>(); // khoi tao Appointment
        
    }
}
