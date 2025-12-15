using System.ComponentModel.DataAnnotations;

namespace Backend.DTO.Request
{
    public class RequestAppointment
    {

        public int AppoinmentId { get; set; }
        public string PatientId { get; set; }

        public DateTime AppointmentDate { get; set; }

        public string Status { get; set; } = string.Empty;

    }
}
