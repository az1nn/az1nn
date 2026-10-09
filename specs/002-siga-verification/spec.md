# Feature 002 — SIGA flow verification and scope arbitration (Spec Kit)
Status: PROPOSED / HUMAN_GATE G1 OPEN
Source: `SKR Siga` audit, 2026-10-09
Canonical target: `.github/skills/siga/SKILL.md` in `az1nn/az1nn`
Relationship: discovery record in `specs/001-skr-grilling/evidence/skr-siga-2026-10-09.md`. This specification does not alter existing SIGA.
Priority: P1 AFTER P0 SKR validation; keep PR #18 independent.

## Intent / user stories
- US1: A user invokes bare `Siga` and gets a deterministic, evidence-based target project/workstream rather than accidental cross-project mutation.
- US2: Every SIGA state is verified against a scenario matrix with reproducible positive and negative inputs.
- US3: Integration with an ORCHESTRATOR draft preserves the 3 SIGA continuation modes and never bypasses human/domain authority.

## Requirements / acceptance criteria
| FR | Requirement | Acceptance criterion | Planned task/test |
|---|---|---|---|
| FR-001 | Canonical source | Exactly one SIGA SKILL.md, root routing resolves it and no alternate definition | ST01/CT01 |
| FR-002 | State classification | Deterministic RESUME, WATCH or ADVANCE for adequate evidence; no duplicate workstreams | ST02/CT02–CT04 |
| FR-003 | Default target scope | When target is ambiguous, policy follows human-approved G1; no mutation based on guessed scope | ST03/CT05 |
| FR-004 | Conflict safety | Stale HEAD or overlapping ownership refuses unsafe writes, preserves negative evidence | ST04/CT06–CT07 |
| FR-005 | Human gates | Explicit architectural, visual, irreversible, cost or merge gates stay unresolved without owner approval | ST05/CT08 |
| FR-006 | Verification truth | Check names, head SHA, exact evidence and NOT_RUN/STALE/FAIL distinctions; never false PASS | ST06/CT09 |
| FR-007 | Handoff | Versioned CAVEMAN handoff can resume without model/chat memory | ST07/CT10 |
| FR-008 | Draft interoperability | Mapping to ORCHESTRATOR BLOCKED/HUMAN_GATE does not silently add SIGA modes or override domain owners | ST08/CT11 |
| FR-009 | Spec Kit traceability | Spec -> plan -> tasks -> decision ledger -> existing roadmap and test evidence are linked | ST09/CT12 |

## Edge cases
Multiple active repositories; missing target; moving branch head; stale PR CI; incomplete running job; revoked ownership; partially approved art REJECT; unresolved constitutional change; Spec Kit CLI unavailable; project with no roadmap.

## Non-goals
Changing SIGA's constitution without explicit approval; merging PR #18/#19; declaring semantic/LLM tests PASS from text-only static checks; deploying a new runtime.
