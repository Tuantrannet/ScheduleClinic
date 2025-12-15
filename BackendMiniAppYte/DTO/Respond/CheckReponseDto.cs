
namespace Backend.DTO.Respond
{
    public class CheckReponseDto 
    {
        public string AccessToken { get; set; } 
        public string RefreshToken { get; set; }
        public bool exists { get; set; }
    }
}
