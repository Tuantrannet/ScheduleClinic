using Backend.Entities;
using Backend.Repositories.Interface;
using Microsoft.EntityFrameworkCore;

namespace Backend.Repositories.Implement
{
    public class StatusRepo : IStatusRepo
    {
        private readonly DataContext _dataContext;

        public StatusRepo(DataContext dataContext)
        {
            _dataContext = dataContext;
        }
        public async Task<List<Status>> GetAllStatus()
        {
            return await _dataContext.Statuses.ToListAsync();
        }
    }
}
