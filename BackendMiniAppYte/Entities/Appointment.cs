using System.ComponentModel.DataAnnotations;

namespace Backend.Enities
{
    public class Appointment
    {
        [Key]
        public int AppointmentId { get; set; }

        [Required(ErrorMessage = "PatientId is required")]
        public string PatientId { get; set; }

        [Required(ErrorMessage = "Appointment date is required")]
        public DateTime Time_start { get; set; }

        [Required(ErrorMessage = "Duration is required")]
        public DateTime Time_end { get; set; }

        [Required(ErrorMessage = "Status is required")]
        public string Status { get; set; } = "Pending";

        public PatientInformation PatientInformation { get; set; } = null!;

    }
}
