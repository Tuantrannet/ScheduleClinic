using Microsoft.AspNetCore.SignalR;
using System.Text.RegularExpressions;

namespace Backend.Hubs
{
    public class BookingHub : Hub
    {
        public async Task JoinDateRoom(string date)
        {
            await Groups.AddToGroupAsync(
                Context.ConnectionId,
                $"booking-{date}"
            );
        }

        public async Task LeaveDateRoom(string date)
        {
            await Groups.RemoveFromGroupAsync(
                Context.ConnectionId,
                $"booking-{date}"
            );
        }
    }
}
