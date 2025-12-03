using Backend.Enities;

namespace Backend.Repositories.Interface
{
    public interface IPatientInformationRepo
    {
        Task<PatientInformation?> GetByIdAsync(int id);
        Task AddAsync(PatientInformation patient);
        Task<bool> UpdateAsync(int Id ,PatientInformation patient);
        Task<bool>  DeleteAsync(int id);

        Task SaveChanges();
    }
}
