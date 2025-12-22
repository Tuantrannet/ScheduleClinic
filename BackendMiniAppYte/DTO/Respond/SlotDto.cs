namespace Backend.DTO.Respond
{
    public class SlotDto
    {
        public TimeOnly Start_Time { get; set; }

        public TimeOnly End_Time { get; private set; }
        public string Status { get; set; } = null!;

        public SlotDto() { }
        public SlotDto(TimeOnly start_Time,int duration,string status)
        {
            Start_Time = start_Time;
            Status = status;
            Calculated_EndTime(duration);

        }
        private  void Calculated_EndTime(int duration)
        {
           End_Time =  Start_Time.AddMinutes(duration);
        }
    }
}
