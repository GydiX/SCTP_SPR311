namespace WebWorker.Models.Users;

public class UserItemModel
{
    public long Id { get; set; }
    public string FullName { get; set; } = string.Empty;
    public string Email { get; set; } = string.Empty;
    public string? Image { get; set; } = null;
    public string[] Roles { get; set; } = [];
}
