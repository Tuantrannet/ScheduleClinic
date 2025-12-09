namespace Backend.DTO.Respond
{
    public class AuthResult
    {
        public string AccessToken { get; set; } = string.Empty;
        public DateTime AccessTokenExpiresAt { get; set; }
        public string RefreshToken { get; set; } = string.Empty; // plaintext returned to client
        public DateTime RefreshTokenExpiresAt { get; set; }
    }
}
