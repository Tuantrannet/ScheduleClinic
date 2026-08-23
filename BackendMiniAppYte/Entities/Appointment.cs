using Backend.Entities;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace Backend.Enities
{
    public class Appointment
    {
        [Key]
        public int AppointmentId { get; set; }

        [Required(ErrorMessage = "PatientId is required")]
        public string PatientId { get; set; }

        [Required(ErrorMessage ="Status is required")]  
        public int StatusId { get; set; }

        public Status Status { get; set; }

        [Required(ErrorMessage = "Appointment date is required")]
        public DateTime Time_start { get; set; }

        [Required(ErrorMessage = "Duration is required")]
        public DateTime Time_end { get; set; }

        [Required(ErrorMessage = "Status is required")]

        public PatientInformation? PatientInformation { get; set; }

    }
}
