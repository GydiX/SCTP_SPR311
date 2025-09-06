using System.ComponentModel.DataAnnotations;

namespace WebWorker.Data.Entities;

public class TrackEntity
{
    [Key]
    public string Id { get; set; } = Guid.NewGuid().ToString();
    
    [Required]
    [MaxLength(200)]
    public string Title { get; set; } = string.Empty;
    
    [Required]
    [MaxLength(200)]
    public string Artist { get; set; } = string.Empty;
    
    [Required]
    [MaxLength(200)]
    public string Album { get; set; } = string.Empty;
    
    public int Duration { get; set; } // в секундах
    
    [MaxLength(500)]
    public string? ImageUrl { get; set; }
    
    [MaxLength(500)]
    public string? PreviewUrl { get; set; }
    
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
}