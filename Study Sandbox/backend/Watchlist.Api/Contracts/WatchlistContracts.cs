namespace Watchlist.Api.Contracts;

public sealed record AddWatchlistItemRequest(string ContentId);

public sealed record WatchlistItemResponse(
    string ContentId,
    DateTimeOffset AddedAt);
