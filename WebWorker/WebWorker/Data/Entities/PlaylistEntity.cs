using System.ComponentModel.DataAnnotations;
using WebWorker.Data.Entities.Identity;

namespace WebWorker.Data.Entities;

public class PlaylistEntity
{
    public long Id { get; set; }
    
    [Required]
    [MaxLength(200)]
    public string Name { get; set; } = string.Empty;
    
    public long UserId { get; set; }
    public virtual UserEntity User { get; set; } = null!;
    
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    public DateTime? UpdatedAt { get; set; }
    
    public virtual ICollection<PlaylistTrackEntity> Tracks { get; set; } = new List<PlaylistTrackEntity>();
}

public class PlaylistTrackEntity
{
    public long Id { get; set; }
    
    public long PlaylistId { get; set; }
    public virtual PlaylistEntity Playlist { get; set; } = null!;
    
    [Required]
    [MaxLength(200)]
    public string TrackId { get; set; } = string.Empty;
    
    [Required]
    [MaxLength(200)]
    public string Title { get; set; } = string.Empty;
    
    [MaxLength(200)]
    public string? Artist { get; set; }
    
    public long? DurationMs { get; set; }
    
    public DateTime AddedAt { get; set; } = DateTime.UtcNow;
}
