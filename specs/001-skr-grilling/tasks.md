# Tasks — Feature 001 SKR

Status legend: [x] implementation present in proposed branch; [ ] pending verification or next work. Do not treat a checked task as PR merged.

## P0 — Contract, routing, Spec Kit

- [x] T01 Define canonical SKR contract under skills/skr/SKILL.md (FR-01,FR-02).
- [x] T02 Add AGENTS.md trigger route and skill catalog entry without duplicating definition (FR-01,FR-10).
- [x] T03 Define full skill-tree audit matrix and positive/negative execution paths (FR-02).
- [x] T04 Make Outro free-text and hybrid choices first-class (FR-03).
- [x] T05 Add evidence-based, human-gate-safe batch autonomy (FR-04,FR-05).
- [x] T06 Define per-skill verification, visual-evidence and report contract (FR-08).
- [x] T07 Add traceable Spec Kit spec/plan/tasks/decision ledger (FR-06).
- [x] T08 Link feature to skills roadmap without altering other work (FR-07).
- [x] T09 Define resume/ownership/failure semantics (FR-09).

## P1 — Validation

- [x] T10 Implement static contract checks and scenario coverage (FR-03,FR-05,FR-08,FR-10).
- [x] T11 Add path-scoped GitHub Actions validation workflow.
- [ ] T12 Confirm CI passes for PR exact HEAD (requires observed job output).
- [ ] T13 Run real SKR + named skill exercise through the connected repository; persist actual outcomes (cannot be asserted by static validator).
  - [x] T13a First live `SKR SIGA` discovery, tree audit and partial negative review persisted in `evidence/skr-siga-2026-10-09.md` (S01 discovery PASS only).
  - [ ] T13b Execute interactive Outro/hybrid, true negative concurrency, decision-ledger roundtrip and resumed-session behavior; full E2E remains NOT_RUN.
- [ ] T14 Review/approve PR and merge under repository gates; never assume approval from drafting this spec.

Dependencies: T12 after T10/T11; T13 after routing; T14 after T12/T13 and review policy.
