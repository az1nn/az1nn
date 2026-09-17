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
- CancellationToken propagated to EF Core operations.
- Study identity isolated behind one helper.

## Frontend

- Feature-oriented API module.
- Mutation state remains explicit for the first iteration.
- Later exercise may introduce a server-state query library and compare the trade-offs.

## Data

`WatchlistItems`:

- `UserId uuid not null`
- `ContentId varchar(120) not null`
- `AddedAt timestamptz not null`
- primary key `(UserId, ContentId)`

## Testing progression

1. unit test domain validation;
2. integration test repeated add;
3. integration test concurrent add;
4. API contract assertions;
5. one browser E2E journey.

## Evolution gates

Do not add cache, broker, outbox or Kubernetes until the exercise explicitly requires the failure mode they solve.
