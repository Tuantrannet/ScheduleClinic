using Backend.DTO.Respond;
using Backend.Enities;
using Backend.Service.IService;

namespace Backend.Service.Service
{
    public class SlotService : ISlotService
    {
        public List<SlotReponseDto> GenerateSlots(
            DateOnly date,
            WorkingHour wh,
            List<Appointment> appointments)
        {
            var slots = new List<SlotReponseDto>();

            void Generate(TimeOnly start, TimeOnly end)
            {
                var baseDate = date.ToDateTime(TimeOnly.MinValue);
                var cursor = baseDate.Date + start.ToTimeSpan();
                var endTime = baseDate.Date + end.ToTimeSpan();

                while (cursor.AddMinutes(wh.Duration) <= endTime)
                {
                    var slotEnd = cursor.AddMinutes(wh.Duration);

                    var status = "available";

                    var overlapping = appointments
                    .Where(a => a.Time_start < slotEnd && a.Time_end > cursor);

                    if (overlapping.Any(a => a.StatusId == 2 || a.StatusId == 6))
                        status = "confirmed";
                    else if (overlapping.Any(a => a.StatusId == 1))
                        status = "reserved";


                    slots.Add(new SlotReponseDto
                    {
                        TimeStart = cursor,
                        TimeEnd = slotEnd,
                        Status = status
                    });

                    cursor = slotEnd;
                }
            }

            Generate(wh.Mor_Start, wh.Mor_End);
            Generate(wh.Aff_Start, wh.Aff_End);

            return slots;
        }
    }
}
