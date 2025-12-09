using AutoMapper;
using Backend.DTO.Respond;
using Backend.Enities;
using Backend.Repositories.Interface;
using Backend.Service.IService;
using Microsoft.EntityFrameworkCore.Update.Internal;

namespace Backend.Service.Service
{
    public class PatientInformationService : IPatientInformationService
    {
        private readonly IPatientInformationRepo patientInformationRepo;
        private readonly IMapper mapper;
        private readonly IUnitOfWork unitOfWork;

        public PatientInformationService(IPatientInformationRepo patientInformationRepo, IMapper mapper
            ,IUnitOfWork unitOfWork)
        {
            this.patientInformationRepo = patientInformationRepo;
            this.mapper = mapper;
            this.unitOfWork = unitOfWork;
        }

        public async Task CreateAsync(PatientInformation patientInformation)
        {
            await patientInformationRepo.AddAsync(patientInformation);

            await unitOfWork.SaveChanges();
        }

        public async Task<PatientInfoDto?> UpdateAsync(int Id ,PatientInformation upPatientInformation)
        {
            var affect = await patientInformationRepo.UpdateAsync(Id, upPatientInformation);

            if (affect == false)
            {
             throw new KeyNotFoundException("Not find data to update");
            }

            var upPatientInfoDto = mapper.Map<PatientInfoDto>(upPatientInformation);
            return upPatientInfoDto;
        }

        public async Task DeleteAsync(int Id)
        {
            var affect = await patientInformationRepo.DeleteAsync(Id);
            if(affect == false)
            {
                throw new KeyNotFoundException("Not find data to Delete");
            }
        }

        public async Task<PatientInfoDto?> GetInformationByIdAsync(int Id)
        {
            var patientInformation = await patientInformationRepo.GetByIdAsync(Id);

            if (patientInformation == null)
            {
                throw new KeyNotFoundException("Not find data");
            }

            var patientInfoDto = mapper.Map<PatientInfoDto>(patientInformation);
            return patientInfoDto;
        }
    }
}
