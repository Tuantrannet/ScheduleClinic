using System.ComponentModel.DataAnnotations;

namespace Backend.Enities
{
    public class WorkingHour
    {
        [Key]
        public int WorkingId { get; set; }
        public TimeSpan TimeStart { get; set; }
        public TimeSpan TimeEnd { get; set; }
        public int Duration { get; set; }
        public string Description { get; set; } = string .Empty;

    }
}
