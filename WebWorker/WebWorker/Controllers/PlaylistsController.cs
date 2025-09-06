using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using WebWorker.Data;
using WebWorker.Models.Playlists;

namespace WebWorker.Controllers;

[Route("api/[controller]")]
[ApiController]
[Authorize]
public class PlaylistsController(AppWorkerDbContext appDbContext) : ControllerBase
{
    [HttpGet]
    public async Task<IActionResult> GetPlaylists()
    {
        var userId = GetCurrentUserId();
        if (userId == null)
            return Unauthorized();

        var playlists = await appDbContext.Playlists
            .Where(p => p.UserId == userId)
            .Include(p => p.Tracks)
            .Select(p => new PlaylistModel
            {
                Id = p.Id,
                Name = p.Name,
                UserId = p.UserId,
                CreatedAt = p.CreatedAt,
                UpdatedAt = p.UpdatedAt,
                Tracks = p.Tracks.Select(t => new PlaylistTrackModel
                {
                    Id = t.Id,
                    TrackId = t.TrackId,
                    Title = t.Title,
                    Artist = t.Artist,
                    DurationMs = t.DurationMs,
                    AddedAt = t.AddedAt
                }).ToList()
            })
            .ToListAsync();

        return Ok(playlists);
    }

    [HttpGet("{id}")]
    public async Task<IActionResult> GetPlaylist(long id)
    {
        var userId = GetCurrentUserId();
        if (userId == null)
            return Unauthorized();

        var playlist = await appDbContext.Playlists
            .Where(p => p.Id == id && p.UserId == userId)
            .Include(p => p.Tracks)
            .Select(p => new PlaylistModel
            {
                Id = p.Id,
                Name = p.Name,
                UserId = p.UserId,
                CreatedAt = p.CreatedAt,
                UpdatedAt = p.UpdatedAt,
                Tracks = p.Tracks.Select(t => new PlaylistTrackModel
                {
                    Id = t.Id,
                    TrackId = t.TrackId,
                    Title = t.Title,
                    Artist = t.Artist,
                    DurationMs = t.DurationMs,
                    AddedAt = t.AddedAt
                }).ToList()
            })
            .FirstOrDefaultAsync();

        if (playlist == null)
            return NotFound();

        return Ok(playlist);
    }

    [HttpPost]
    public async Task<IActionResult> CreatePlaylist([FromBody] CreatePlaylistModel model)
    {
        var userId = GetCurrentUserId();
        if (userId == null)
            return Unauthorized();

        if (string.IsNullOrWhiteSpace(model.Name))
            return BadRequest("Playlist name is required");

        var playlist = new Data.Entities.PlaylistEntity
        {
            Name = model.Name.Trim(),
            UserId = userId.Value,
            CreatedAt = DateTime.UtcNow
        };

        appDbContext.Playlists.Add(playlist);
        await appDbContext.SaveChangesAsync();

        var result = new PlaylistModel
        {
            Id = playlist.Id,
            Name = playlist.Name,
            UserId = playlist.UserId,
            CreatedAt = playlist.CreatedAt,
            UpdatedAt = playlist.UpdatedAt,
            Tracks = new List<PlaylistTrackModel>()
        };

        return CreatedAtAction(nameof(GetPlaylist), new { id = playlist.Id }, result);
    }

    [HttpPut("{id}")]
    public async Task<IActionResult> UpdatePlaylist(long id, [FromBody] UpdatePlaylistModel model)
    {
        var userId = GetCurrentUserId();
        if (userId == null)
            return Unauthorized();

        if (string.IsNullOrWhiteSpace(model.Name))
            return BadRequest("Playlist name is required");

        var playlist = await appDbContext.Playlists
            .FirstOrDefaultAsync(p => p.Id == id && p.UserId == userId);

        if (playlist == null)
            return NotFound();

        playlist.Name = model.Name.Trim();
        playlist.UpdatedAt = DateTime.UtcNow;

        await appDbContext.SaveChangesAsync();

        return NoContent();
    }

    [HttpDelete("{id}")]
    public async Task<IActionResult> DeletePlaylist(long id)
    {
        var userId = GetCurrentUserId();
        if (userId == null)
            return Unauthorized();

        var playlist = await appDbContext.Playlists
            .FirstOrDefaultAsync(p => p.Id == id && p.UserId == userId);

        if (playlist == null)
            return NotFound();

        appDbContext.Playlists.Remove(playlist);
        await appDbContext.SaveChangesAsync();

        return NoContent();
    }

    [HttpPost("{id}/tracks")]
    public async Task<IActionResult> AddTrackToPlaylist(long id, [FromBody] AddTrackToPlaylistModel model)
    {
        var userId = GetCurrentUserId();
        if (userId == null)
            return Unauthorized();

        if (string.IsNullOrWhiteSpace(model.TrackId) || string.IsNullOrWhiteSpace(model.Title))
            return BadRequest("TrackId and Title are required");

        var playlist = await appDbContext.Playlists
            .FirstOrDefaultAsync(p => p.Id == id && p.UserId == userId);

        if (playlist == null)
            return NotFound();

        // Check if track already exists in playlist
        var existingTrack = await appDbContext.PlaylistTracks
            .FirstOrDefaultAsync(t => t.PlaylistId == id && t.TrackId == model.TrackId);

        if (existingTrack != null)
            return Conflict("Track already exists in playlist");

        var track = new Data.Entities.PlaylistTrackEntity
        {
            PlaylistId = id,
            TrackId = model.TrackId,
            Title = model.Title,
            Artist = model.Artist,
            DurationMs = model.DurationMs,
            AddedAt = DateTime.UtcNow
        };

        appDbContext.PlaylistTracks.Add(track);
        await appDbContext.SaveChangesAsync();

        var result = new PlaylistTrackModel
        {
            Id = track.Id,
            TrackId = track.TrackId,
            Title = track.Title,
            Artist = track.Artist,
            DurationMs = track.DurationMs,
            AddedAt = track.AddedAt
        };

        return CreatedAtAction(nameof(GetPlaylist), new { id }, result);
    }

    [HttpDelete("{id}/tracks/{trackId}")]
    public async Task<IActionResult> RemoveTrackFromPlaylist(long id, string trackId)
    {
        var userId = GetCurrentUserId();
        if (userId == null)
            return Unauthorized();

        var playlist = await appDbContext.Playlists
            .FirstOrDefaultAsync(p => p.Id == id && p.UserId == userId);

        if (playlist == null)
            return NotFound();

        var track = await appDbContext.PlaylistTracks
            .FirstOrDefaultAsync(t => t.PlaylistId == id && t.TrackId == trackId);

        if (track == null)
            return NotFound();

        appDbContext.PlaylistTracks.Remove(track);
        await appDbContext.SaveChangesAsync();

        return NoContent();
    }

    private long? GetCurrentUserId()
    {
        var userIdClaim = User.FindFirst("sub") ?? User.FindFirst("id");
        if (userIdClaim != null && long.TryParse(userIdClaim.Value, out var userId))
            return userId;
        return null;
    }
}
