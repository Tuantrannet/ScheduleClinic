namespace Backend.DTO.Respond
{
    public class AppointmentDto
    {
        public int AppointmentId { get; set; }

        public string PatientId { get; set; }

        public int StatusId { get; set; }

        public string Status { get; set; }   // ✅ StatusName

        public DateTime TimeStart { get; set; }
        public DateTime TimeEnd { get; set; }
    }
}
