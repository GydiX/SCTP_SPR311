using WebWorker.Data.Entities.Identity;

namespace WebWorker.Interfaces;

public interface IJwtTokenService
{
    Task<string> GenerateTokenAsync(UserEntity user);
}
