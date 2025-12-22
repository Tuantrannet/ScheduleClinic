using Backend.Entities;
using System.ComponentModel.DataAnnotations;

namespace Backend.Entities
{
    public class Appointment
    {
        [Required]
        [Key]
        public int AppointmentId { get; set; }

        public string PatientId { get; set; } = null!;

        public DateOnly AppointmentDate { get; set; }

        [Required(ErrorMessage = "Status is required")]
        public string Status { get; set; } = "Pending";

        public PatientInformation PatientInformation { get; set; } = null!;

        public TimeOnly Start_Time { get; set; }

        public TimeOnly End_Time { get; set; }

    }
}
