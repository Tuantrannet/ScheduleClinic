namespace Backend.DTO.Request
{
    public class AppointmentFilterRequest
    {
        public string? zaloId { get; set; }
        public int page { get; set; } = 1;
        public int? statusId { get; set; }

        public DateOnly? fromDate { get; set; }
        public DateOnly? toDate { get; set; }

        // chỉ dùng nếu FE có nút "xem 1 ngày" riêng
        public DateOnly? Date { get; set; }
    }
}
