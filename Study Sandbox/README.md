# NTT-G Study Sandbox

Implementation playground for the **NTT-G Handbook V4**.

The sandbox uses one vertical slice — **Minha Lista / Watchlist** — to practice the same feature from contract to production thinking.

## Stack

- Backend: ASP.NET Core / .NET 10
- Persistence: EF Core + PostgreSQL
- Frontend: React + TypeScript + Vite
- Process: Spec-Driven Development / Spec Kit style artifacts
- Testing path: unit -> integration -> contract -> E2E

> `.NET + React` is the study stack selected from the current preparation context. It is not a claim about the exact internal stack of the future squad.

## Study loop

| Day | Focus | Sandbox outcome |
| --- | --- | --- |
| 1 | .NET API + EF Core | contract + persistence + idempotent add |
| 2 | React | API client + mutation UI states |
| 3 | Reliability | auth boundary + tests + telemetry thinking |
| 4 | SDD / Spec Kit / AI | spec -> plan -> tasks -> implementation gate |
| 5 | Production | containers, capacity, rollout and system design |

## Quick start

Run commands from `Study Sandbox/` unless noted otherwise.

### 1. Database

```bash
docker compose up -d db
```

The database starts **empty**. Schema ownership belongs to EF Core migrations rather than Docker bootstrap SQL.

If you created the earlier disposable bootstrap volume, reset it once:

```bash
docker compose down -v
docker compose up -d db
```

### 2. Restore the EF tool and apply migrations

```bash
dotnet tool restore
dotnet ef database update \
  --project backend/Watchlist.Api \
  --startup-project backend/Watchlist.Api
```

The migration history is recorded by EF Core in `__EFMigrationsHistory`.

See [`docs/MIGRATIONS.md`](docs/MIGRATIONS.md) for the create/review/script/apply/rollback lifecycle.

### 3. Backend

```bash
dotnet run --project backend/Watchlist.Api
```

API defaults to `http://localhost:5080`.

### 4. Frontend

In another terminal:

```bash
cd frontend
npm install
npm run dev
```

Vite defaults to `http://localhost:5173` and proxies `/api` to the backend.

## First endpoints

```text
GET    /health
GET    /api/v1/watchlist
POST   /api/v1/watchlist/items
DELETE /api/v1/watchlist/items/{contentId}
```

The sandbox currently uses the `X-Study-User` header as a deliberately explicit study-only identity boundary. Replacing it with real authentication is a later exercise.

Example:

```bash
curl -H 'X-Study-User: 11111111-1111-1111-1111-111111111111' \
  http://localhost:5080/api/v1/watchlist
```

Add one item:

```bash
curl -X POST \
  -H 'Content-Type: application/json' \
  -H 'X-Study-User: 11111111-1111-1111-1111-111111111111' \
  -d '{"contentId":"globo-content-001"}' \
  http://localhost:5080/api/v1/watchlist/items
```

## Day 1 executable proof

After the database is up and migrations are applied:

```bash
./scripts/day1-smoke.sh
```

The script starts the API and proves:

- repeated sequential POST does not duplicate state;
- GET sees exactly one persisted item;
- DELETE is idempotent (`204` twice);
- invalid content returns ValidationProblem with `400`, `errors.contentId` and a `traceId`.

CI runs the same proof against PostgreSQL 17. This automation is evidence of behavior; during the study session, rerun it and explain **why** each assertion holds.

## Migration validation without a database

CI also asks EF Core to produce an idempotent SQL script:

```bash
dotnet ef migrations script --idempotent \
  --project backend/Watchlist.Api \
  --startup-project backend/Watchlist.Api
```

This does not prove production rollout safety, but it catches broken migration metadata/tooling early.

## Source of truth

Start with:

1. `.specify/memory/constitution.md`
2. `.specify/specs/001-watchlist/spec.md`
3. `.specify/specs/001-watchlist/plan.md`
4. `.specify/specs/001-watchlist/tasks.md`
5. `docs/STUDY_PLAN.md`
6. `docs/MIGRATIONS.md`

The rule is simple: **do not add implementation work that cannot be traced back to a requirement, task or explicit learning experiment.**
