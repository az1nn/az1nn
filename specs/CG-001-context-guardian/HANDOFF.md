# CAVEMAN HANDOFF v1 — SPEC-CG-001 M0

APP: az1nn/az1nn (portable skills)
WORKSTREAM: SIGA Context Guardian
STATE: M0 DOCS IN DRAFT PR; NO ACTIVE SKILL OR RUNTIME
MODE: ADVANCE (new workstream after reconciliation)
CANONICAL SOURCE: https://github.com/az1nn/az1nn ; SIGA protocol at `.github/skills/siga/SKILL.md`

CURRENT VERSION / HEAD: branch `docs/spec-cg-001-context-guardian`. Always resolve live HEAD on the next invocation; the handoff file itself changes the commit SHA.
BASE: `main@cf2e85f72be4aced0af34918842e8175f04d4ceb` at M0 creation
BRANCH / ENV: docs/spec-cg-001-context-guardian / GitHub draft documentation
PR / MR / TASK: https://github.com/az1nn/az1nn/pull/20
SPEC / ADR: `specs/CG-001-context-guardian/spec.md`; ADR-CG-001 and ADR-CG-002 are PROPOSED, not ratified

DONE:
- Reconciled main canonical SIGA, draft PR #18 portable Godot tree, PR #19 SKR/roadmap and Observatory PR #1.
- Created Context Guardian documentation, proposed contract, decision ledger, checklist and task backlog.
- Defined risk/decision/handoff assessment without provider telemetry and without runtime implementation.

VERIFY:
- Documentation created through GitHub tool and linked to PR #20.
- Repository checks must be inspected on the **latest exact HEAD** after this handoff commit; prior check status is not transferable.
- No Spec Kit CLI tests or executable contract validation performed. Treat as NOT_RUN.

GATES:
- PR remains DRAFT / NO MERGE.
- M1 and constitutional/hard-blocking modifications require separate authorization.
- PR #19's draft roadmap SKR P0 / SIGA P1 not modified; CG-001 priority awaits reconciliation.

BLOCKERS:
- No native ChatGPT internal context-window telemetry.
- No permanent cross-chat access or continuous background monitoring from the proposed skill.
- Implementable shared decision-registry authority/storage and exact triggering policy require future review.

INVARIANTS:
- REAL STATE > HANDOFF > MEMORY > CHAT; VERIFY-FIRST; SIGA only orchestration authority.
- No inferred approvals or context-window utilization percentages.
- No transcripts/private details pushed to public repo by default.
- Observatory stays PoC / future planning only.

NEXT:
- Verify PR #20 exact HEAD, changed-file list and CI results.
- Request review of documentary proposal/ADR tradeoffs and roadmap placement.
- Do NOT implement M1, merge, or activate skill without explicit approval.

VERIFY-FIRST:
1. Read GitHub `main` and PR #20 live heads.
2. Inspect PR #18/#19 state, ownership and roadmap drift.
3. Inspect PR #20 checks at exact SHA; classify NOT_RUN/UNKNOWN honestly.
4. Reconcile decisions from `decisions.md`, spec, ADR proposals and any human feedback before executing.
