namespace Backend.DTO.Respond
{
    public class AppointmentDto
    {
        public int AppointmentId { get; set; }

        public string Status { get; set; } = string.Empty;


        public DateTime AppointmentDate { get; set; }

        public PatientInfoDto? PatientInfo { get; set; }
    }
}
