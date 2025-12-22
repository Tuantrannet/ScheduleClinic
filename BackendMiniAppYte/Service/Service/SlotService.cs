using Backend.DTO.Respond;
using Backend.Entities;
using Backend.Repositories.Interface;
using Backend.Service.IService;
using Microsoft.EntityFrameworkCore;

namespace Backend.Service.Service
{
    public class SlotService : ISlotService
    {
        private readonly IAppointmentRepo appointmentRepo;
        private readonly IWorkingHourRepo workingHourRepo;

        public SlotService(IAppointmentRepo appointmentRepo, IWorkingHourRepo workingHourRepo)
        {
            this.appointmentRepo = appointmentRepo;
            this.workingHourRepo = workingHourRepo;
        }

        public async Task<List<SlotDto>> Get_Slot_From_Day(DateOnly selectedDay)
        {
            var workingHour = await workingHourRepo.Get_First_WorkingHour_Async();
            if(workingHour == null)
            {
                throw new ArgumentNullException("WorkingHour is null");
            }
            var queryAppointment = await appointmentRepo.Get_Appointment_By_Date(selectedDay, workingHour.Mor_Start, workingHour.Aff_End);

            var dicAppointments = queryAppointment.ToDictionary(x => x.Start_Time);
            var resultList = new List<SlotDto>();

            var morningApp = Generate_Slot_For_Time(workingHour.Mor_Start,workingHour.Mor_End,workingHour.Duration,dicAppointments);
            resultList.AddRange(morningApp);

            var affApp = Generate_Slot_For_Time(workingHour.Aff_Start, workingHour.Aff_End, workingHour.Duration, dicAppointments);
            resultList.AddRange(affApp);

            return resultList.OrderBy(x=> x.Start_Time).ToList();
        }

        private static List<SlotDto> Generate_Slot_For_Time(TimeOnly timeStart, TimeOnly timeEnd, int duration, Dictionary<TimeOnly,Appointment> dicAppointments)
        {
            var timeSpan = timeEnd - timeStart;
            int numberOfDuration = (int)timeSpan.TotalMinutes / duration;

            var slotList = new List<SlotDto>();


            //for(int i=0;i< numberOfDuration; i++)
            //{
            //    var newTimeStart = timeStart.AddMinutes(duration * i);
            //    var appointment = appointments.FirstOrDefault(x => x.Start_Time == newTimeStart);
            //    if(appointment == null)
            //    {
            //        var newSlot = new SlotDto(newTimeStart,duration,"Available");
            //        slotList.Add(newSlot);
            //    }
            //    else
            //    {
            //        if (appointment.Status == "Pending")
            //        {
            //            var newSlot = new SlotDto(newTimeStart,duration,"Pending");
            //            slotList.Add(newSlot);
            //        }else if (appointment.Status == "Accept")
            //        {
            //            var newSlot = new SlotDto(newTimeStart, duration, "Confirm");
            //            slotList.Add(newSlot);
            //        }
            //    }

            //}

            for (int i = 0; i < numberOfDuration; i++)
            {
                var newTimeStart = timeStart.AddMinutes(duration * i);
    
                if(dicAppointments.TryGetValue(newTimeStart, out var appointment) && appointment != null)
                {
                    if(appointment.Status =="Pending")
                    {
                        var newSlot = new SlotDto(newTimeStart, duration, "Pending");
                        slotList.Add(newSlot);
                    }
                    else
                    {
                        var newSlot = new SlotDto(newTimeStart, duration, "Confirm");
                        slotList.Add(newSlot);
                    }
                }
                else
                {
                    var newSlot = new SlotDto(newTimeStart, duration, "Available");
                    slotList.Add(newSlot);
                }



            }

            return slotList;


        }
    }
}
