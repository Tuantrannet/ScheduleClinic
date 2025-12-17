using System.ComponentModel.DataAnnotations;

namespace Backend.DTO.Request
{
    public class CreatePatientRequestDto
    {

        public string PatientName { get; set; }

        public string Gender { get; set; }

        public DateOnly Birthday { get; set; }
        public string PhoneNumber { get; set; }

        public string? CCCD { get; set; }
    }
}
