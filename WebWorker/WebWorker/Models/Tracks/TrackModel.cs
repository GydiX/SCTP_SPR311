namespace WebWorker.Models.Tracks;

public class TrackModel
{
    public string Id { get; set; } = string.Empty;
    public string Title { get; set; } = string.Empty;
    public string Artist { get; set; } = string.Empty;
    public string Album { get; set; } = string.Empty;
    public int Duration { get; set; } // в секундах
    public string? ImageUrl { get; set; }
    public string? PreviewUrl { get; set; }
}

public class SearchResultsModel
{
    public List<TrackModel> Tracks { get; set; } = new();
    public int Total { get; set; }
    public string Query { get; set; } = string.Empty;
}