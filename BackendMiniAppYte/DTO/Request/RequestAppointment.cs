using System.ComponentModel.DataAnnotations;

namespace Backend.DTO.Request
{
    public class RequestAppointment
    {
        public int AppoinmentId { get; set; }
        [Required]
        public string PatientId { get; set; }

        [Required]
        public DateTime Time_Start { get; set; }

        [Required]
        public DateTime Time_End { get; set; }


    }
}
