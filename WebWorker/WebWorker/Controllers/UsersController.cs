using Microsoft.AspNetCore.Mvc;
using WebWorker.Data;
using WebWorker.Models.Users;

namespace WebWorker.Controllers;

[Route("api/[controller]")]
[ApiController]
public class UsersController(AppWorkerDbContext appDbContext) : ControllerBase
{
    [HttpGet("list")]
    public async Task<IActionResult> GetUsers()
    {
        var users = appDbContext.Users
            .Select(x => new UserItemModel
            {
                Id = x.Id,
                FullName = $"{x.FirstName ?? string.Empty} {x.LastName ?? string.Empty}",
                Email = x.Email ?? string.Empty,
                Image = x.Image,
                Roles = x.UserRoles!
                        .Select(r => r.Role!.Name ?? string.Empty)
                        .ToArray()
            })
            .ToList();
        return Ok(users);
    }
}
