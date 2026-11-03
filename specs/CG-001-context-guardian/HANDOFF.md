# CAVEMAN HANDOFF v1 — SPEC-CG-001 M0

APP: az1nn/az1nn (portable skills)
WORKSTREAM: SIGA Context Guardian
STATE: CG-008 M0 DOCUMENTARY RECONCILIATION; ADRS IN MAIN PR #21; NO RUNTIME/M1
MODE: RESUME for documentary M02/M03; WATCH if outstanding checks/human gates
CANONICAL SOURCE: https://github.com/az1nn/az1nn ; SIGA protocol at `.github/skills/siga/SKILL.md`

CURRENT VERSION / HEAD: branch `docs/spec-cg-001-context-guardian`. Always resolve live HEAD on the next invocation; the handoff file itself changes the commit SHA.
BASE: `main@cf2e85f72be4aced0af34918842e8175f04d4ceb` at M0 creation
BRANCH / ENV: docs/spec-cg-001-context-guardian / GitHub draft documentation
PR / MR / TASK: https://github.com/az1nn/az1nn/pull/20
SPEC / ADR: `specs/CG-001-context-guardian/spec.md`; ADR-CG-001 and ADR-CG-002 already in main via PR #21 (documentary only)

DONE:
- Reconciled main canonical SIGA, draft PR #18 portable Godot tree, PR #19 SKR/roadmap and Observatory PR #1.
- Created Context Guardian documentation, proposed contract, decision ledger, checklist and task backlog.
- Defined risk/decision/handoff assessment without provider telemetry and without runtime implementation.
- CG-007: documented CG-O01–O05=A; ADR-CG-002=A approved documentarily; ADR-CG-001=B revised so Context Guardian is **SIGA-internal**, not a separate skill. Documentary publication of both ADRs completed; constitutional ratification remains a separate gate.

VERIFY:
- Documentation created through GitHub tool and linked to PR #20.
- Repository checks must be inspected on the **latest exact HEAD** after this handoff commit; prior check status is not transferable.
- No Spec Kit CLI tests or executable contract validation performed. Treat as NOT_RUN.

GATES:
- PR remains DRAFT / NO MERGE.
- M1 and constitutional/hard-blocking modifications require separate authorization.
- CG-O05=A preserves PR #19's draft roadmap SKR P0 / SIGA P1; no roadmap change committed.
- Both ADRs published documentarily via PR #21; not a constitutional ratification.

BLOCKERS:
- No native ChatGPT internal context-window telemetry.
- No permanent cross-chat access or continuous background monitoring from the proposed skill.
- Ledger-per-project (CG-O01=A) and trigger at SIGA invocation/handoff (CG-O02=A) are **approved design choices** but not executable yet.
- The runtime/constitutional implications of integrated-SIGA architecture require a separate future decision.

INVARIANTS:
- REAL STATE > HANDOFF > MEMORY > CHAT; VERIFY-FIRST; SIGA only orchestration authority.
- No inferred approvals or context-window utilization percentages.
- No transcripts/private details pushed to public repo by default.
- Observatory stays PoC / future planning only.
- No second Context Guardian orchestrator or callable skill is authorized; the documentation folder is not a runtime registration.

NEXT:
- Verify PR #20 exact HEAD, changed-file list and CI results.
- M02=A/M03=A: reconcile and prepare eight M0 documents for merge; SIGA internal design documentation under `.github/skills/siga/context-guardian.md`.
- M01=A: repair SKR PR #19 CI; M04=A: audit Godot PR #18 constitutional scope. Do not conflate documentary merge with executable authorization.
- PR #20 documentary merge may proceed only under M02=A and eligible gates. Do NOT implement M1, activate a new skill, or modify SIGA canonical runtime without separate explicit authorization.

VERIFY-FIRST:
1. Read GitHub `main` and PR #20 live heads.
2. Inspect PR #18/#19 state, ownership and roadmap drift.
3. Inspect PR #20 checks at exact SHA; classify NOT_RUN/UNKNOWN honestly.
4. Reconcile decisions from `decisions.md`, spec, ADR proposals and any human feedback before executing.
