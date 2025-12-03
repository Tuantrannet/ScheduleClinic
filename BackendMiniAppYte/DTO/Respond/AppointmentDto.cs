namespace Backend.DTO.Respond
{
    public class AppointmentDto
    {
        public int AppointmentId { get; set; }

        public string Status { get; set; } = string.Empty;

        public string ReasonForVisit { get; set; } = string.Empty ;

        public string ReasonForReject { get; set; } = string.Empty;

        public DateTimeOffset AppointmentDate { get; set; }

        public PatientInfoDto? PatientInfo { get; set; }
    }
}
