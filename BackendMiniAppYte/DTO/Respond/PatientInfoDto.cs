using System.ComponentModel.DataAnnotations;

namespace Backend.DTO.Respond
{
    public class PatientInfoDto
    {
        public string PatientName { get; set; } = string.Empty;

        [StringLength(10)]
        public string? Gender { get; set; }  // "Male", "Female", "Other"

        [Required(ErrorMessage = "Số điện thoại là bắt buộc.")]
        [Phone(ErrorMessage = "Số điện thoại không hợp lệ.")]
        [StringLength(10)]
        public string PhoneNumber { get; set; }
    }
}
