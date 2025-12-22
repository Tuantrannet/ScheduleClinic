using Backend.DTO.Respond;
using Backend.Entities;

namespace Backend.Service.IService
{
    public interface IPatientInformationService
    {
        Task CreateAsync(PatientInformation addInformation);

        Task<PatientInfoDto?> UpdateAsync(string Id, PatientInformation upPatientInformation);

        Task DeleteAsync(string Id);
        Task<PatientInfoDto?> GetInformationByIdAsync(string Id);


    }
}
