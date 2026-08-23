using Backend.Enities;
using System.ComponentModel.DataAnnotations;

namespace Backend.Entities
{
    public class Status
    {
        [Key]
        public int Id { get; set; }

        [Required]
        public string Name { get; set; }
        public ICollection<Appointment> Appointments { get; set; }
    }
}
