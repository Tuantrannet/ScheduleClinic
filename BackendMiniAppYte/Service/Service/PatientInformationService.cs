using Backend.Enities;
using Backend.Repositories.Interface;
using Backend.Service.IService;
using Microsoft.EntityFrameworkCore.Update.Internal;

namespace Backend.Service.Service
{
    public class PatientInformationService : IPatientInformationService
    {
        private readonly IPatientInformationRepo patientInformationRepo;

        public PatientInformationService(IPatientInformationRepo patientInformationRepo)
        {
            this.patientInformationRepo = patientInformationRepo;
        }

        public async Task CreateAsync(PatientInformation patientInformation)
        {
            await patientInformationRepo.AddAsync(patientInformation);

            await patientInformationRepo.SaveChanges();
        }

        public async Task<PatientInformation?> UpdateAsync(int Id ,PatientInformation upPatientInformation)
        {
            var affect = await patientInformationRepo.UpdateAsync(Id, upPatientInformation);

            if (affect == false)
            {
             throw new KeyNotFoundException("Not find data to update");
            }

            return upPatientInformation;
        }

        public async Task DeleteAsync(int Id)
        {
            var affect = await patientInformationRepo.DeleteAsync(Id);
            if(affect == false)
            {
                throw new KeyNotFoundException("Not find data to Delete");
            }
        }

        public async Task<PatientInformation?> GetInformationByIdAsync(int Id)
        {
            var patientInformation = await patientInformationRepo.GetByIdAsync(Id);

            return patientInformation; ;
        }
    }
}
