using System.ComponentModel.DataAnnotations;

namespace Backend.DTO
{
    public class RequestAppointment
    {

        public int AppoinmentId { get; set; }
        public int PatientId { get; set; }

        public DateTimeOffset AppointmentDate { get; set; }

        public string Status { get; set; } = string.Empty;

        public string ReasonForVisit { get; set; } = string.Empty;

        public string ReasonForReject { get; set; } = string.Empty;
    }
}
