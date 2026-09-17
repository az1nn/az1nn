# Plan — 001 Watchlist

## Technical shape

```text
React/Vite
   |
   | HTTP / JSON
   v
ASP.NET Core Minimal API
   |
   v
EF Core -> PostgreSQL
```

## Backend

- Minimal API for a compact learning surface.
- DTOs at HTTP boundary.
- `WatchlistItem` domain/persistence model.
- Composite key `(UserId, ContentId)` enforces the invariant.
- `CancellationToken` propagated to EF Core operations.
- Study identity isolated behind one helper.
- Duplicate-write recovery handles only PostgreSQL unique violation on `PK_watchlist_items`; unrelated DB failures continue to surface as failures.

## Frontend

- Feature-oriented API module.
- Mutation state remains explicit for the first iteration.
- Later exercise may introduce a server-state query library and compare the trade-offs.

## Data

`watchlist_items`:

- `user_id uuid not null`
- `content_id varchar(120) not null`
- `added_at timestamptz not null`
- primary key `(user_id, content_id)`

Schema lifecycle:

- EF Core migrations are the source of truth for schema transitions.
- Docker starts PostgreSQL only; it does not create application tables.
- Local migration application is explicit through `dotnet ef database update`.
- CI validates idempotent SQL generation and applies the migration to a real PostgreSQL 17 service.
- Production-style evolution should use reviewed deployment migration steps rather than every app replica auto-migrating at startup.

## Testing progression

Day 1 automated smoke already covers:

- sequential duplicate add -> one persisted item;
- repeated delete -> `204` twice;
- validation -> stable ValidationProblem shape.

The next testing layer remains:

1. unit test domain validation;
2. integration test with `WebApplicationFactory`;
3. integration test concurrent add;
4. explicit API contract assertions;
5. one browser E2E journey.

The shell smoke is a fast executable proof, not a replacement for the Day 3 test suite.

## Evolution gates

Do not add cache, broker, outbox or Kubernetes until the exercise explicitly requires the failure mode they solve.
