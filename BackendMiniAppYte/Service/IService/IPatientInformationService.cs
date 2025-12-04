using Backend.DTO.Respond;
using Backend.Enities;

namespace Backend.Service.IService
{
    public interface IPatientInformationService
    {
        Task CreateAsync(PatientInformation addInformation);

        Task<PatientInfoDto?> UpdateAsync(int Id, PatientInformation upPatientInformation);

        Task DeleteAsync(int Id);
        Task<PatientInfoDto?> GetInformationByIdAsync(int Id);


    }
}
