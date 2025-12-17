namespace Backend.Service.IService
{
    public interface IBookingHubService
    {
        Task NotifySlotChanged(DateOnly date);
    }
}
