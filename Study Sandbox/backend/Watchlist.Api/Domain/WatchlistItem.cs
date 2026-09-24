namespace Watchlist.Api.Domain;

public sealed class WatchlistItem
{
    public Guid UserId { get; private set; }
    public string ContentId { get; private set; } = string.Empty;
    public DateTimeOffset AddedAt { get; private set; }

    private WatchlistItem() { }

    public WatchlistItem(Guid userId, string contentId, DateTimeOffset addedAt)
    {
        if (userId == Guid.Empty)
            throw new ArgumentException("User id is required.", nameof(userId));

        if (string.IsNullOrWhiteSpace(contentId))
            throw new ArgumentException("Content id is required.", nameof(contentId));

        UserId = userId;
        ContentId = contentId.Trim();
        AddedAt = addedAt;
    }
}
