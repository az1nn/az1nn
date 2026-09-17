using Microsoft.EntityFrameworkCore;
using Npgsql;
using Watchlist.Api.Contracts;
using Watchlist.Api.Data;
using Watchlist.Api.Domain;

var builder = WebApplication.CreateBuilder(args);

var connectionString = builder.Configuration.GetConnectionString("Watchlist")
    ?? "Host=localhost;Port=5432;Database=watchlist;Username=watchlist;Password=watchlist";

builder.Services.AddDbContext<WatchlistDbContext>(options =>
    options.UseNpgsql(connectionString));

builder.Services.AddProblemDetails();
builder.Services.AddCors(options =>
{
    options.AddDefaultPolicy(policy => policy
        .WithOrigins("http://localhost:5173")
        .AllowAnyHeader()
        .AllowAnyMethod());
});

var app = builder.Build();
app.UseExceptionHandler();
app.UseCors();

app.MapGet("/health", () => Results.Ok(new { status = "ok" }));

var watchlist = app.MapGroup("/api/v1/watchlist");

watchlist.MapGet("/", async (
    HttpContext http,
    WatchlistDbContext db,
    CancellationToken ct) =>
{
    if (!TryGetStudyUser(http, out var userId))
        return Results.Unauthorized();

    var items = await db.WatchlistItems
        .AsNoTracking()
        .Where(x => x.UserId == userId)
        .OrderByDescending(x => x.AddedAt)
        .Select(x => new WatchlistItemResponse(x.ContentId, x.AddedAt))
        .ToListAsync(ct);

    return Results.Ok(items);
});

watchlist.MapPost("/items", async (
    AddWatchlistItemRequest request,
    HttpContext http,
    WatchlistDbContext db,
    CancellationToken ct) =>
{
    if (!TryGetStudyUser(http, out var userId))
        return Results.Unauthorized();

    if (string.IsNullOrWhiteSpace(request.ContentId))
    {
        return Results.ValidationProblem(
            errors: new Dictionary<string, string[]>
            {
                ["contentId"] = ["Content id is required."]
            },
            statusCode: StatusCodes.Status400BadRequest,
            title: "Request validation failed.",
            extensions: new Dictionary<string, object?>
            {
                ["traceId"] = http.TraceIdentifier
            });
    }

    var contentId = request.ContentId.Trim();

    var existing = await db.WatchlistItems
        .AsNoTracking()
        .SingleOrDefaultAsync(
            x => x.UserId == userId && x.ContentId == contentId,
            ct);

    if (existing is not null)
        return Results.Ok(new WatchlistItemResponse(existing.ContentId, existing.AddedAt));

    var item = new WatchlistItem(userId, contentId, DateTimeOffset.UtcNow);
    db.Add(item);

    try
    {
        await db.SaveChangesAsync(ct);
    }
    catch (DbUpdateException ex) when (
        ex.InnerException is PostgresException
        {
            SqlState: PostgresErrorCodes.UniqueViolation,
            ConstraintName: "PK_watchlist_items"
        })
    {
        db.ChangeTracker.Clear();

        var winner = await db.WatchlistItems
            .AsNoTracking()
            .SingleAsync(
                x => x.UserId == userId && x.ContentId == contentId,
                ct);

        return Results.Ok(new WatchlistItemResponse(winner.ContentId, winner.AddedAt));
    }

    return Results.Ok(new WatchlistItemResponse(item.ContentId, item.AddedAt));
});

watchlist.MapDelete("/items/{contentId}", async (
    string contentId,
    HttpContext http,
    WatchlistDbContext db,
    CancellationToken ct) =>
{
    if (!TryGetStudyUser(http, out var userId))
        return Results.Unauthorized();

    var item = await db.WatchlistItems
        .SingleOrDefaultAsync(
            x => x.UserId == userId && x.ContentId == contentId,
            ct);

    if (item is not null)
    {
        db.Remove(item);
        await db.SaveChangesAsync(ct);
    }

    return Results.NoContent();
});

app.Run();

static bool TryGetStudyUser(HttpContext http, out Guid userId)
{
    var raw = http.Request.Headers["X-Study-User"].FirstOrDefault();
    return Guid.TryParse(raw, out userId) && userId != Guid.Empty;
}

public partial class Program { }
