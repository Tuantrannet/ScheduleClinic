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


        public async Task<PatientInformation?> GetByIdAsync(string id)
        {
            // Bao gồm Appointments nếu cần (dùng .Include)
            return await dataContext.PatientInformations
                                 .FirstOrDefaultAsync(p => p.ZaloId == id);
        }

        public async Task AddAsync(PatientInformation patient)
        {
            await dataContext.PatientInformations.AddAsync(patient);

        }

        public async Task<bool> UpdateAsync(string Id ,PatientInformation patient)
        {
            var affect = await dataContext.PatientInformations
                                                .Where(x => x.ZaloId == Id)
                                                .ExecuteUpdateAsync(x => x.SetProperty(u => u.PatientName, patient.PatientName)
                                                .SetProperty(u => u.Gender,patient.Gender)
                                                .SetProperty(u=> u.PhoneNumber, patient.PhoneNumber));

            return affect>0;
        }

        public async Task<bool> DeleteAsync(string Id)
        {
            var affect = await dataContext.PatientInformations.Where(x => x.ZaloId == Id).ExecuteDeleteAsync();
            return affect > 0;
        }

        public async Task<bool> ExistsAsync(string id)
        {
            return await dataContext.PatientInformations.AnyAsync(e => e.ZaloId == id);
        }

    }
}
