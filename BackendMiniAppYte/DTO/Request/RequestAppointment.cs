using System.ComponentModel.DataAnnotations;

namespace Backend.DTO.Request
{
    public class RequestAppointment
    {
        public int AppoinmentId { get; set; }
        public string PatientId { get; set; }

        public DateTime Time_Start { get; set; }

        public DateTime Time_End { get; set; }


    }
}
