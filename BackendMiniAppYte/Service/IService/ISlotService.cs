using Backend.DTO.Respond;

namespace Backend.Service.IService
{
    public interface ISlotService
    {
        Task<List<SlotDto>> Get_Slot_From_Day(DateOnly selectedDay);
    }
}
