using Microsoft.AspNetCore.Mvc;
using System.Net.Http.Headers;
using WebWorker.Interfaces;

namespace WebWorker.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class SpotifyController(ISpotifyAuthService spotifyAuth) : ControllerBase
    {
        [HttpGet("search")] // /api/spotify/search?q=
        public async Task<IActionResult> Search([FromQuery] string q, [FromQuery] string type = "track", [FromQuery] int limit = 10)
        {
            if (string.IsNullOrWhiteSpace(q)) return BadRequest("Query is required");
            var token = await spotifyAuth.GetAppAccessTokenAsync();
            using var http = new HttpClient();
            http.DefaultRequestHeaders.Authorization = new AuthenticationHeaderValue("Bearer", token);
            var url = $"https://api.spotify.com/v1/search?q={Uri.EscapeDataString(q)}&type={type}&limit={limit}";
            var resp = await http.GetAsync(url);
            var text = await resp.Content.ReadAsStringAsync();
            return Content(text, "application/json");
        }

        [HttpGet("tracks/{id}")]
        public async Task<IActionResult> GetTrack(string id)
        {
            var token = await spotifyAuth.GetAppAccessTokenAsync();
            using var http = new HttpClient();
            http.DefaultRequestHeaders.Authorization = new AuthenticationHeaderValue("Bearer", token);
            var url = $"https://api.spotify.com/v1/tracks/{id}";
            var resp = await http.GetAsync(url);
            var text = await resp.Content.ReadAsStringAsync();
            return Content(text, "application/json");
        }
    }
}


