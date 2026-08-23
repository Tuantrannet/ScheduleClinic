using AutoMapper;
using Backend.DTO.Respond;
using Backend.Enities;

namespace Backend.MiddleWare
{
    public class AutoMappingProfile : Profile
    {
        public AutoMappingProfile()
        {
            //Appointment
            CreateMap<Appointment, AppointmentDto>()
            .ForMember(dest => dest.Status,
                opt => opt.MapFrom(src => src.Status.Name))
            .ForMember(dest => dest.TimeStart,
                opt => opt.MapFrom(src => src.Time_start))
            .ForMember(dest => dest.TimeEnd,
                opt => opt.MapFrom(src => src.Time_end));


            CreateMap<PatientInformation, PatientInfoDto>();        }
    }
}
