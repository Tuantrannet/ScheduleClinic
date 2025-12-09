using Backend.Enities;
using Backend.Repositories.Interface;
using Microsoft.EntityFrameworkCore;

namespace Backend.Repositories.Implement
{
    public class PatientInformationRepo : IPatientInformationRepo
    {
        private readonly DataContext dataContext;

        public PatientInformationRepo(DataContext dataContext)
        {
            this.dataContext = dataContext;
        }


        public async Task<PatientInformation?> GetByIdAsync(int id)
        {
            // Bao gồm Appointments nếu cần (dùng .Include)
            return await dataContext.PatientInformations
                                 .FirstOrDefaultAsync(p => p.PatientId == id);
        }

        public async Task AddAsync(PatientInformation patient)
        {
            await dataContext.PatientInformations.AddAsync(patient);

        }

        public async Task<bool> UpdateAsync(int Id ,PatientInformation patient)
        {
            var affect = await dataContext.PatientInformations
                                                .Where(x => x.PatientId == Id)
                                                .ExecuteUpdateAsync(x => x.SetProperty(u => u.PatientName, patient.PatientName)
                                                .SetProperty(u => u.Gender,patient.Gender)
                                                .SetProperty(u=> u.PhoneNumber, patient.PhoneNumber));

            return affect>0;
        }

        public async Task<bool> DeleteAsync(int Id)
        {
            var affect = await dataContext.PatientInformations.Where(x => x.PatientId == Id).ExecuteDeleteAsync();
            return affect > 0;
        }

        public async Task<bool> ExistsAsync(int id)
        {
            return await dataContext.PatientInformations.AnyAsync(e => e.PatientId == id);
        }

    }
}
