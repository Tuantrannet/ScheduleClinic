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
                    .ForMember( dest => dest.PatientInfo , opt => opt.MapFrom(src => src.PatientInformation));

            CreateMap<PatientInformation, PatientInfoDto>();
        }
    }
}
