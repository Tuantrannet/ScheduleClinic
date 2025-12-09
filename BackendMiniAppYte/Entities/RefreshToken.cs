namespace Backend.Entities
{
    public class RefreshToken
    {
        public int Id { get; set; }
        public int UserId { get; set; }
        public string TokenHash { get; set; } = string.Empty; // hashed token
        public DateTime ExpiresAt { get; set; }
        public DateTime CreatedAt { get; set; }
        public string? CreatedByIp { get; set; }
        public bool Revoked { get; set; } = false;
        public DateTime? RevokedAt { get; set; }
        public string? ReplacedByTokenHash { get; set; } // for rotation chain
    }
}
