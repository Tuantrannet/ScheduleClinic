using System.ComponentModel.DataAnnotations;

namespace Backend.Enities
{
    public class WorkingHour
    {
        [Key]
        public int WorkingId { get; set; }
        public TimeOnly Mor_Start { get; set; }
        public TimeOnly Mor_End { get; set; }
        public TimeOnly Aff_Start { get; set; }

        public TimeOnly Aff_End {  get; set; }
        public int Duration { get; set; }

    }
}
