using Microsoft.EntityFrameworkCore;
using Watchlist.Api.Domain;

namespace Watchlist.Api.Data;

public sealed class WatchlistDbContext(DbContextOptions<WatchlistDbContext> options)
    : DbContext(options)
{
    public DbSet<WatchlistItem> WatchlistItems => Set<WatchlistItem>();

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        modelBuilder.Entity<WatchlistItem>(entity =>
        {
            entity.ToTable("watchlist_items");
            entity.HasKey(x => new { x.UserId, x.ContentId });
            entity.Property(x => x.UserId).HasColumnName("user_id");
            entity.Property(x => x.ContentId)
                .HasColumnName("content_id")
                .HasMaxLength(120);
            entity.Property(x => x.AddedAt).HasColumnName("added_at");
        });
    }
}
