using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore;
using WebWorker.Data.Entities.Identity;
using WebWorker.Data.Entities;

namespace WebWorker.Data;

public class AppWorkerDbContext : IdentityDbContext<UserEntity, RoleEntity, long,
    IdentityUserClaim<long>, UserRoleEntity, IdentityUserLogin<long>,
    IdentityRoleClaim<long>, IdentityUserToken<long>>
{
    public AppWorkerDbContext(DbContextOptions<AppWorkerDbContext> options) : base(options)
    {
    }

    public DbSet<TrackEntity> Tracks { get; set; }

    protected override void OnModelCreating(ModelBuilder builder)
    {
        base.OnModelCreating(builder);
        // Configure UserRoleEntity
        builder.Entity<UserRoleEntity>(ur =>
        {
            ur.HasOne(ur => ur.Role)
                .WithMany(r => r.UserRoles)
                .HasForeignKey(r => r.RoleId)
                .IsRequired();

            ur.HasOne(ur => ur.User)
                .WithMany(r => r.UserRoles)
                .HasForeignKey(u => u.UserId)
                .IsRequired();
        });
    }
}