using Backend.DTO.Request;
using Backend.DTO.Respond;
using Backend.Enities;

namespace Backend.Service.IService
{
    public interface IPatientInformationService
    {
        Task CreateAsync(CreatePatientRequestDto addInformation,string zaloid);

        Task<CreatePatientRequestDto?> UpdateAsync(string Id, CreatePatientRequestDto upPatientInformation);

        Task DeleteAsync(string Id);
        Task<PatientInfoDto?> GetInformationByIdAsync(string Id);
        Task<bool> CheckZaloIdAsync(string id);


    }
}
