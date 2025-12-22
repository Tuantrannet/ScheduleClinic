using Backend.Entities;

namespace Backend.Repositories.Interface
{
    public interface IPatientInformationRepo
    {
        Task<PatientInformation?> GetByIdAsync(string id);
        Task AddAsync(PatientInformation patient);
        Task<bool> UpdateAsync(string Id ,PatientInformation patient);
        Task<bool>  DeleteAsync(string id);
    }
}
