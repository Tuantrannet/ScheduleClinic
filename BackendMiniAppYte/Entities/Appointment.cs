using System.ComponentModel.DataAnnotations;

namespace Backend.Enities
{
    public class Appointment
    {
        [Required]
        [Key]
        public int AppointmentId { get; set; }

        public int PatientId { get; set; }

        public DateTimeOffset AppointmentDate { get; set; }

        [Required(ErrorMessage = "Status is required")]
        public string Status { get; set; } = "Pending";

        public PatientInformation PatientInformation { get; set; } = null!;

    }
}
