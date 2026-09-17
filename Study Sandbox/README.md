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

### Database

```bash
docker compose up -d db
```

### Backend

```bash
cd backend/Watchlist.Api
dotnet restore
dotnet run
```

API defaults to `http://localhost:5080`.

### Frontend

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

## Source of truth

Start with:

1. `.specify/memory/constitution.md`
2. `.specify/specs/001-watchlist/spec.md`
3. `.specify/specs/001-watchlist/plan.md`
4. `.specify/specs/001-watchlist/tasks.md`
5. `docs/STUDY_PLAN.md`

The rule is simple: **do not add implementation work that cannot be traced back to a requirement, task or explicit learning experiment.**
