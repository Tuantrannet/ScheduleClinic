using Backend.Hubs;
using Backend.Service.IService;
using Microsoft.AspNetCore.SignalR;

namespace Backend.Service.Service
{
    public class BookingHubService : IBookingHubService
    {
        private readonly IHubContext<BookingHub> _hub;

        public BookingHubService(IHubContext<BookingHub> hub)
        {
            _hub = hub;
        }

        public async Task NotifySlotChanged(DateOnly date)
        {
            var groupName = $"booking-{date:yyyy-MM-dd}";

            await _hub.Clients.Group(groupName)
                .SendAsync("SlotChanged", new
                {
                    date = date.ToString("yyyy-MM-dd")
                });
        }
    }
}
