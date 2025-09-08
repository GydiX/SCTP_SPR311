using System.Threading.Tasks;

namespace WebWorker.Interfaces
{
    public interface ISpotifyAuthService
    {
        Task<string> GetAppAccessTokenAsync();
    }
}


