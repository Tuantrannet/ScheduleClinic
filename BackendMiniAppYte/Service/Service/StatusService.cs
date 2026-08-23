using Backend.Entities;
using Backend.Repositories.Interface;
using Backend.Service.IService;

namespace Backend.Service.Service
{
    public class StatusService : IStatusService
    {
        public readonly IStatusRepo _statusRepo;
        public StatusService(IStatusRepo statusRepo)
        {
            _statusRepo = statusRepo;
        }
        public async Task<List<Status>> GetStatuses()
        {
            return await _statusRepo.GetAllStatus();
        }
    }
}
