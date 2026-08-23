using Backend.Entities;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

namespace Backend.Service.IService
{

    public interface IStatusService
    {
        Task<List<Status>> GetStatuses();
    }
}
