using System.ComponentModel.DataAnnotations;

namespace Backend.Enities
{
    public class PatientInformation
    {
        [Key]
        public int PatientId { get; set; }

        [StringLength(50)]
        public string? ZaloId { get; set; }

        [Required(ErrorMessage = "Tên là bắt buộc.")]
        [StringLength(100)]
        public string PatientName { get; set; }

        [StringLength(10)]
        public string? Gender { get; set; }  // "Male", "Female", "Other"

        [Required(ErrorMessage = "Số điện thoại là bắt buộc.")]
        [Phone(ErrorMessage = "Số điện thoại không hợp lệ.")]
        [StringLength(10)]
        public string PhoneNumber { get; set; }

        public ICollection<Appointment> Appointments { get; set; } = new List<Appointment>(); // khoi tao Appointment
        
    }
}
