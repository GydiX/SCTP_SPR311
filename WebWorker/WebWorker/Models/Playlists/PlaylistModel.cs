namespace WebWorker.Models.Playlists;

public class PlaylistModel
{
    public long Id { get; set; }
    public string Name { get; set; } = string.Empty;
    public long UserId { get; set; }
    public DateTime CreatedAt { get; set; }
    public DateTime? UpdatedAt { get; set; }
    public List<PlaylistTrackModel> Tracks { get; set; } = new();
}

public class PlaylistTrackModel
{
    public long Id { get; set; }
    public string TrackId { get; set; } = string.Empty;
    public string Title { get; set; } = string.Empty;
    public string? Artist { get; set; }
    public long? DurationMs { get; set; }
    public DateTime AddedAt { get; set; }
}

public class CreatePlaylistModel
{
    public string Name { get; set; } = string.Empty;
}

public class AddTrackToPlaylistModel
{
    public string TrackId { get; set; } = string.Empty;
    public string Title { get; set; } = string.Empty;
    public string? Artist { get; set; }
    public long? DurationMs { get; set; }
}

public class UpdatePlaylistModel
{
    public string Name { get; set; } = string.Empty;
}
