using System.ComponentModel.DataAnnotations;

namespace Backend.DTO.Request
{
    public class RequestAppointment
    {

        public int AppoinmentId { get; set; }
        public string PatientId { get; set; }

        public DateOnly AppointmentDate { get; set; }

        public string Status { get; set; } = string.Empty;

    }
}
