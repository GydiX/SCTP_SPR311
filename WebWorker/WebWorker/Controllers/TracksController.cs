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

    [HttpPost("create")]
    public async Task<IActionResult> CreateTrack([FromBody] CreateTrackModel createTrackModel)
    {
        if (!ModelState.IsValid)
        {
            return BadRequest(ModelState);
        }

        var trackEntity = new TrackEntity
        {
            Id = Guid.NewGuid().ToString(),
            Title = createTrackModel.Title,
            Artist = createTrackModel.Artist,
            Album = createTrackModel.Album,
            Duration = createTrackModel.Duration,
            ImageUrl = createTrackModel.ImageUrl,
            PreviewUrl = createTrackModel.PreviewUrl
        };

        appDbContext.Tracks.Add(trackEntity);
        await appDbContext.SaveChangesAsync();

        var trackModel = new TrackModel
        {
            Id = trackEntity.Id,
            Title = trackEntity.Title,
            Artist = trackEntity.Artist,
            Album = trackEntity.Album,
            Duration = trackEntity.Duration,
            ImageUrl = trackEntity.ImageUrl,
            PreviewUrl = trackEntity.PreviewUrl
        };

        return CreatedAtAction(nameof(GetTrackById), new { id = trackEntity.Id }, trackModel);
    }

    [HttpGet("{id}")]
    public async Task<IActionResult> GetTrackById(string id)
    {
        var track = await appDbContext.Tracks
            .Where(t => t.Id == id)
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
            .FirstOrDefaultAsync();

        if (track == null)
        {
            return NotFound($"Трек з ID {id} не знайдено");
        }

        return Ok(track);
    }

    [HttpPut("{id}")]
    public async Task<IActionResult> UpdateTrack(string id, [FromBody] CreateTrackModel updateTrackModel)
    {
        if (!ModelState.IsValid)
        {
            return BadRequest(ModelState);
        }

        var trackEntity = await appDbContext.Tracks.FindAsync(id);
        if (trackEntity == null)
        {
            return NotFound($"Трек з ID {id} не знайдено");
        }

        trackEntity.Title = updateTrackModel.Title;
        trackEntity.Artist = updateTrackModel.Artist;
        trackEntity.Album = updateTrackModel.Album;
        trackEntity.Duration = updateTrackModel.Duration;
        trackEntity.ImageUrl = updateTrackModel.ImageUrl;
        trackEntity.PreviewUrl = updateTrackModel.PreviewUrl;

        await appDbContext.SaveChangesAsync();

        var trackModel = new TrackModel
        {
            Id = trackEntity.Id,
            Title = trackEntity.Title,
            Artist = trackEntity.Artist,
            Album = trackEntity.Album,
            Duration = trackEntity.Duration,
            ImageUrl = trackEntity.ImageUrl,
            PreviewUrl = trackEntity.PreviewUrl
        };

        return Ok(trackModel);
    }

    [HttpDelete("{id}")]
    public async Task<IActionResult> DeleteTrack(string id)
    {
        var trackEntity = await appDbContext.Tracks.FindAsync(id);
        if (trackEntity == null)
        {
            return NotFound($"Трек з ID {id} не знайдено");
        }

        appDbContext.Tracks.Remove(trackEntity);
        await appDbContext.SaveChangesAsync();

        return Ok($"Трек {trackEntity.Title} успішно видалено");
    }

    [HttpDelete("all")]
    public async Task<IActionResult> DeleteAllTracks()
    {
        // Видаляємо всі треки одним запитом
        var deletedCount = await appDbContext.Tracks.ExecuteDeleteAsync();
        return Ok($"Видалено треків: {deletedCount}");
    }
}