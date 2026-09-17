# Tasks — 001 Watchlist

## Baseline scaffold

- [x] T001 Create ASP.NET Core project and EF Core model.
- [x] T002 Create React/Vite project skeleton.
- [x] T003 Define watchlist HTTP contract.
- [x] T004 Add PostgreSQL docker-compose service and disposable bootstrap schema.
- [x] T005 Add SDD artifacts and study plan.

## Day 1

- [ ] T101 Replace bootstrap SQL with the first EF Core migration and document the migration lifecycle.
- [ ] T102 Run POST twice and prove one persisted item.
- [x] T103 Baseline DELETE is idempotent; explain and test the behavior.
- [ ] T104 Narrow the concurrency catch to PostgreSQL unique-violation only.
- [ ] T105 Add/verify ProblemDetails-style validation response.

## Day 2

- [x] T201 Baseline UI loads the watchlist.
- [x] T202 Baseline UI has add/remove mutation states.
- [ ] T203 Improve accessible pending/error feedback.
- [ ] T204 Compare local state with a server-state query library.

## Day 3

- [ ] T301 Add backend unit test project.
- [ ] T302 Add integration test project using WebApplicationFactory.
- [ ] T303 Prove two concurrent POSTs produce one row.
- [ ] T304 Add request correlation/trace exploration.

## Day 4

- [ ] T401 Run a spec -> plan -> tasks consistency review.
- [ ] T402 Give an AI agent exactly one bounded task.
- [ ] T403 Record implementation evidence and rejected scope expansion.
- [ ] T404 Run a convergence review and create follow-up tasks only for real gaps.

## Day 5

- [ ] T501 Define readiness/liveness semantics.
- [ ] T502 Define SLIs and one candidate SLO.
- [ ] T503 Write rollout + rollback notes.
- [ ] T504 Perform a 10-minute system-design rehearsal.
