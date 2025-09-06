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

    public DbSet<PlaylistEntity> Playlists { get; set; }
    public DbSet<TrackEntity> Tracks { get; set; }
    public DbSet<PlaylistTrackEntity> PlaylistTracks { get; set; }

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

        // Configure PlaylistEntity
        builder.Entity<PlaylistEntity>(p =>
        {
            p.HasOne(p => p.User)
                .WithMany()
                .HasForeignKey(p => p.UserId)
                .IsRequired()
                .OnDelete(DeleteBehavior.Cascade);

            p.HasMany(p => p.Tracks)
                .WithOne(t => t.Playlist)
                .HasForeignKey(t => t.PlaylistId)
                .IsRequired()
                .OnDelete(DeleteBehavior.Cascade);
        });

        // Configure PlaylistTrackEntity
        builder.Entity<PlaylistTrackEntity>(t =>
        {
            t.HasIndex(t => new { t.PlaylistId, t.TrackId }).IsUnique();
        });
    }
}