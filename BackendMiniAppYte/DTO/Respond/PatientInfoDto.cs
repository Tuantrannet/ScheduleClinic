using System.ComponentModel.DataAnnotations;

namespace Backend.DTO.Respond
{
    public class PatientInfoDto
    {
        public string PatientName { get; set; } = string.Empty;


        public string Gender { get; set; }  // "Male", "Female", "Other"

        public DateOnly Birthday { get; set; }

        public string PhoneNumber { get; set; }

        public string? CCCD { get; set; }


    }
}
