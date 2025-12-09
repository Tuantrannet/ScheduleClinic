namespace Backend.DTO.Model
{
    public class JwtSettings
    {
        public string Issuer { get; set; } = "your-app";
        public string Audience { get; set; } = "your-app-audience";
        public string Secret { get; set; } = ""; // from configuration, >32 bytes recommended
        public int AccessTokenExpirationMinutes { get; set; } = 15;
        public int RefreshTokenExpirationDays { get; set; } = 30;
    }
}
