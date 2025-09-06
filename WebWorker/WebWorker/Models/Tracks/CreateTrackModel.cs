using System.ComponentModel.DataAnnotations;

namespace WebWorker.Models.Tracks;

public class CreateTrackModel
{
    [Required(ErrorMessage = "Назва треку обов'язкова")]
    [StringLength(200, ErrorMessage = "Назва треку не може перевищувати 200 символів")]
    public string Title { get; set; } = string.Empty;

    [Required(ErrorMessage = "Виконавець обов'язковий")]
    [StringLength(200, ErrorMessage = "Ім'я виконавця не може перевищувати 200 символів")]
    public string Artist { get; set; } = string.Empty;

    [Required(ErrorMessage = "Альбом обов'язковий")]
    [StringLength(200, ErrorMessage = "Назва альбому не може перевищувати 200 символів")]
    public string Album { get; set; } = string.Empty;

    [Required(ErrorMessage = "Тривалість обов'язкова")]
    [Range(1, 3600, ErrorMessage = "Тривалість повинна бути від 1 до 3600 секунд")]
    public int Duration { get; set; }

    [Url(ErrorMessage = "Неправильний формат URL для зображення")]
    public string? ImageUrl { get; set; }

    [Url(ErrorMessage = "Неправильний формат URL для прев'ю")]
    public string? PreviewUrl { get; set; }
}
