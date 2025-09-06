using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using WebWorker.Data;
using WebWorker.Models.Tracks;
using WebWorker.Data.Entities;

namespace WebWorker.Controllers;

[Route("api/[controller]")]
[ApiController]
public class TracksController(AppWorkerDbContext appDbContext) : ControllerBase
{
    [HttpGet("search")]
    public async Task<IActionResult> SearchTracks([FromQuery] string q)
    {
        if (string.IsNullOrWhiteSpace(q))
        {
            return Ok(new SearchResultsModel
            {
                Tracks = new List<TrackModel>(),
                Total = 0,
                Query = q
            });
        }

        var tracks = await appDbContext.Tracks
            .Where(t => t.Title.Contains(q) || 
                       t.Artist.Contains(q) || 
                       t.Album.Contains(q))
            .Select(t => new TrackModel
            {
                Id = t.Id,
                Title = t.Title,
                Artist = t.Artist,
                Album = t.Album,
                Duration = t.Duration,
                ImageUrl = t.ImageUrl,
                PreviewUrl = t.PreviewUrl
            })
            .ToListAsync();

        return Ok(new SearchResultsModel
        {
            Tracks = tracks,
            Total = tracks.Count,
            Query = q
        });
    }

    [HttpGet("all")]
    public async Task<IActionResult> GetAllTracks()
    {
        var tracks = await appDbContext.Tracks
            .Select(t => new TrackModel
            {
                Id = t.Id,
                Title = t.Title,
                Artist = t.Artist,
                Album = t.Album,
                Duration = t.Duration,
                ImageUrl = t.ImageUrl,
                PreviewUrl = t.PreviewUrl
            })
            .ToListAsync();

        return Ok(tracks);
    }

    [HttpPost("seed")]
    public async Task<IActionResult> SeedTracks()
    {
        // Додаємо тестові треки
        var testTracks = new List<TrackEntity>
        {
            new TrackEntity
            {
                Title = "Bohemian Rhapsody",
                Artist = "Queen",
                Album = "A Night at the Opera",
                Duration = 355,
                ImageUrl = "https://via.placeholder.com/300x300?text=Queen"
            },
            new TrackEntity
            {
                Title = "Imagine",
                Artist = "John Lennon",
                Album = "Imagine",
                Duration = 183,
                ImageUrl = "https://via.placeholder.com/300x300?text=John+Lennon"
            },
            new TrackEntity
            {
                Title = "Hotel California",
                Artist = "Eagles",
                Album = "Hotel California",
                Duration = 391,
                ImageUrl = "https://via.placeholder.com/300x300?text=Eagles"
            },
            new TrackEntity
            {
                Title = "Stairway to Heaven",
                Artist = "Led Zeppelin",
                Album = "Led Zeppelin IV",
                Duration = 482,
                ImageUrl = "https://via.placeholder.com/300x300?text=Led+Zeppelin"
            },
            new TrackEntity
            {
                Title = "Sweet Child O' Mine",
                Artist = "Guns N' Roses",
                Album = "Appetite for Destruction",
                Duration = 356,
                ImageUrl = "https://via.placeholder.com/300x300?text=Guns+N+Roses"
            }
        };

        appDbContext.Tracks.AddRange(testTracks);
        await appDbContext.SaveChangesAsync();

        return Ok($"Додано {testTracks.Count} тестових треків");
    }
}