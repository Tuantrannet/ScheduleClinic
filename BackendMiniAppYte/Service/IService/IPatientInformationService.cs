using Backend.Enities;

namespace Backend.Service.IService
{
    public interface IPatientInformationService
    {
        Task CreateAsync(PatientInformation addInformation);

        Task<PatientInformation?> UpdateAsync(int Id, PatientInformation upInformation);

        Task DeleteAsync(int Id);

        Task<PatientInformation?> GetInformationByIdAsync(int Id);


    }
}
