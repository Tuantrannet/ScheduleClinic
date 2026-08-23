using Microsoft.EntityFrameworkCore.Metadata.Conventions;
using System.ComponentModel.DataAnnotations;

namespace Backend.Enities
{
    public class PatientInformation
    {
        [Key]
        public string ZaloId { get; set; }

        [Required(ErrorMessage = "Vui lòng nhập tên.")]
        [StringLength(100)]
        public string PatientName { get; set; }

        [Required(ErrorMessage = "Vui lòng nhập giới tính.")]

        [StringLength(10)]
        public string Gender { get; set; }  

        [Required(ErrorMessage = "Vui lòng nhập ngày sinh.")]
        public DateOnly Birthday { get; set; }

        [Required(ErrorMessage = "Vui lòng nhập số điện thoại.")]
        [StringLength(10, MinimumLength = 10, ErrorMessage = "Số điện thoại phải có chính xác 10 ký tự.")]
        [Phone(ErrorMessage = "Số điện thoại không hợp lệ.")]
        public string PhoneNumber { get; set; }

        public string? CCCD { get; set; }

        public ICollection<Appointment> Appointments { get; set; } = new List<Appointment>(); 
        
    }
}
