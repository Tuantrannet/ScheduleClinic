using Backend.DTO.Respond;
using Backend.Enities;

namespace Backend.Service.IService
{
    public interface ISlotService
    {
        List<SlotReponseDto> GenerateSlots(
        DateOnly date,
        WorkingHour workingHour,
        List<Appointment> appointments
    );
    }
}
