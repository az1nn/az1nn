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
- [x] T12 Confirm PR exact-head **static contract CI**: [PR workflow 41049499963](https://github.com/az1nn/az1nn/actions/runs/41049499963) and [push workflow 41049490949](https://github.com/az1nn/az1nn/actions/runs/41049490949) succeeded on `6218137c921aa07a3b42af9411819fd19595bc31` (29/29 static checks in prior verified run). Revalidate again after this documentation update; static PASS does not cover T13 behavioral E2E.
- [ ] T13 Run real SKR + named skill exercise through the connected repository; persist actual outcomes (cannot be asserted by static validator).
  - [x] T13a First live `SKR SIGA` discovery, tree audit and partial negative review persisted in `evidence/skr-siga-2026-10-09.md` (S01 discovery PASS only).
  - [ ] T13b Execute interactive Outro/hybrid, true negative concurrency, decision-ledger roundtrip and resumed-session behavior; full E2E remains NOT_RUN.
- [ ] T14 Review/approve PR and merge under repository gates; never assume approval from drafting this spec.

Dependencies: T12 after T10/T11; T13 after routing; T14 after T12/T13 and review policy.

## Reopen/merge-safety workstream (31/10/2026)

- [x] T15 Reopen closed PR #19 without merge; reconcile branch with `main@a1c8582013fab617afee35a18cddff4b70cf3d43` using an explicit two-parent commit, preserving Context Guardian M0 documents.
- [x] T16 Add `skills/skr/tests/verify-release-integrity.mjs` with **12 deterministic static/repository-artifact checks**; wire into existing `SKR Contract` workflow alongside 29 existing checks. On `f8ffeab37137a6643dc947b957b1187aaac16c49`, push and PR `static-contract` completed **SUCCESS**. These checks are **not agent behavioral E2E**.
- [ ] T17 Run real SKR agent + human/host interactive E2E (S03/S04/S05/S09/S11/S12/S14/S15/S16); attach session transcript **sanitized**, observable UI input payload, decision ledger roundtrip and independently reviewed output. Not supplied in this workstream; **NOT_RUN**.
- [ ] T18 Review/approve merged-scope changes, confirm no human gate, then merge PR #19 using SHA lease. **NO MERGE while T13/T17 are unverified**.

See `skills/skr/tests/manual-acceptance.md` for executable human test procedure and `specs/001-skr-grilling/evidence/merge-readiness-2026-10-31.md` for exact evidence status. No canonical SIGA code change, constitutional ratification, new authority, or Context Guardian M1 implementation.
