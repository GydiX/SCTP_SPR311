using System.Net.Http.Headers;
using System.Text;
using System.Text.Json;
using WebWorker.Interfaces;

namespace WebWorker.Services
{
    public class SpotifyAuthService(IConfiguration configuration) : ISpotifyAuthService
    {
        private string _cachedToken = string.Empty;
        private DateTime _expiresAtUtc = DateTime.MinValue;

        public async Task<string> GetAppAccessTokenAsync()
        {
            if (!string.IsNullOrEmpty(_cachedToken) && DateTime.UtcNow < _expiresAtUtc)
            {
                return _cachedToken;
            }

            var clientId = configuration["Spotify:ClientId"];
            var clientSecret = configuration["Spotify:ClientSecret"];
            if (string.IsNullOrEmpty(clientId) || string.IsNullOrEmpty(clientSecret))
            {
                throw new InvalidOperationException("Spotify credentials are not configured.");
            }

            using var http = new HttpClient();
            var body = new FormUrlEncodedContent(new[]
            {
                new KeyValuePair<string, string>("grant_type", "client_credentials")
            });
            var auth = Convert.ToBase64String(Encoding.UTF8.GetBytes($"{clientId}:{clientSecret}"));
            http.DefaultRequestHeaders.Authorization = new AuthenticationHeaderValue("Basic", auth);

            var response = await http.PostAsync("https://accounts.spotify.com/api/token", body);
            response.EnsureSuccessStatusCode();

            using var stream = await response.Content.ReadAsStreamAsync();
            var json = await JsonSerializer.DeserializeAsync<SpotifyTokenResponse>(stream);
            _cachedToken = json!.access_token;
            _expiresAtUtc = DateTime.UtcNow.AddSeconds(json.expires_in - 30);
            return _cachedToken;
        }

        private record SpotifyTokenResponse(string access_token, string token_type, int expires_in);
    }
}


