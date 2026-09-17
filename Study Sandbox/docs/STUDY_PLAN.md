# Study Plan

Use one hour per session.

## Session clock

- 00-10 — recall concepts without code
- 10-35 — implement one bounded task
- 35-50 — exercise / failure case
- 50-60 — explain the result without notes

## Day 1 — Backend contract

- Run PostgreSQL.
- Run the API.
- Inspect the unique `(UserId, ContentId)` key.
- Add the first migration.
- Prove repeated `POST` does not duplicate state.

## Day 2 — React

- Run the Vite app.
- Add query/loading/error states.
- Add remove behavior.
- Explain server state vs UI state vs derived state.

## Day 3 — Reliability

- Replace study identity with a testable auth boundary.
- Add integration tests.
- Add a concurrency test.
- Trace a request from browser -> API -> DB.

## Day 4 — SDD + AI

- Review spec, plan and tasks before touching code.
- Implement exactly one task using an AI coding agent.
- Reject any unrelated refactor.
- Record evidence and gaps.

## Day 5 — Production thinking

- Containerize API/frontend if useful.
- Define readiness/liveness semantics.
- Define SLIs and one SLO.
- Explain rollout, migration and rollback.
- Run a 10-minute system-design rehearsal.
