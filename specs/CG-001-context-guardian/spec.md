# SPEC-CG-001 — SIGA Context Guardian

Status: **PROPOSED — M0 DOCUMENTATION ONLY**  
Date: 2026-10-29  
Owner: SIGA process authority (integration proposal)  
Target: `az1nn/az1nn/skills/context-guardian`

## Problem
Long ChatGPT-native sessions may no longer expose all earlier constraints, decisions and evidence. In the native chat there is no reliable API-free readout of the model's actual context-window size, currently retained token count or compaction events. SIGA must preserve continuity without inventing telemetry, re-deciding approved choices or mistaking a summary for canonical project truth.

## User stories
1. As SIGA, on an explicit invocation, I can assess the **available sample** and expose its known coverage limits.
2. As a user, I see context-risk **signals**, not fake window percentages or claims of unseen memory access.
3. As a domain owner, my approved/rejected decisions remain traceable to their evidence and cannot be silently overwritten.
4. As a resumed SIGA instance, I reconcile current repository reality and handoff before new mutations.
5. As an operator, I can copy/transfer a versioned, compact, sanitised handoff to another session without depending on chat history.
6. As a reviewer, I see unknown/partial source coverage and pending human decisions rather than manufactured success.

## Requirements
| ID | Requirement | Acceptance |
|---|---|---|
| CG-FR01 | Honest telemetry taxonomy | Character count of supplied text is `MEASURED_SAMPLE`; token range is `HEURISTIC`; actual window usage is `UNAVAILABLE`. No fabricated percentages. |
| CG-FR02 | Explicit coverage | Every assessment states source, `observed_at`, sample scope, and coverage `COMPLETE_SAMPLE/PARTIAL/UNKNOWN`. `COMPLETE_SAMPLE` never means complete model context. |
| CG-FR03 | Risk signals | Rules identify long supplied samples, missing reference decisions, stale handoff/HEAD, source gaps or uncertain provenance; signals include evidence and severity. No high window occupancy assertions. |
| CG-FR04 | Decision registry | Preserve `PROPOSED/APPROVED/REJECTED/SUPERSEDED` with stable ID, owner/authority, provenance and replacement references. Assistant inference cannot create approval. |
| CG-FR05 | Conflict handling | Divergent approved decisions route to existing `DOMAIN_CONFLICT`/`HUMAN_GATE` authority as appropriate; Guardian cannot resolve or manufacture new gates. |
| CG-FR06 | Handoff validation | Reuse canonical CAVEMAN HANDOFF v1 and, where applicable, optional Observatory HandoffEnvelope v1 extension without replacing its fields. Verify source, version/HEAD, decisions, blockers, restrictions, next and VERIFY-FIRST. |
| CG-FR07 | Session continuity | A new SIGA invocation verifies real state first; chat-memory summaries are hints only. No automatic opening or reading of other ChatGPT chats is assumed. |
| CG-FR08 | Governance | Changes to blocker authority, skill topology, execution rights or constitutional invariants remain proposed until human approval. |
| CG-FR09 | Privacy | Default to hashes/IDs, source links and minimal summaries. Never publish full private transcript or secrets in a public repo. |
| CG-FR10 | Non-invasive M0 | No executable skill trigger, registry registration, running agent, new MCP tool, backend, merge or Observatory dependency in this PR. |

## Output signals (advisory)
- `CONTEXT_UNOBSERVABLE` — current real window use cannot be measured (informational).
- `SAMPLE_LARGE` — supplied text exceeds an explicitly documented configurable character threshold; says nothing about window fill.
- `SOURCE_COVERAGE_PARTIAL` — incomplete or unclear input history.
- `DECISION_MISSING` — tracked decision absent from the provided reconstruction; cannot infer forgetting.
- `DECISION_CONFLICT` — competing decision evidence with incompatible claims; route to existing owner.
- `HANDOFF_INCOMPLETE` — required resumability fields absent.
- `HANDOFF_STALE` — persisted SHA/ref differs from verified current state; run RECONCILE.
- `EVIDENCE_UNAVAILABLE` — evidence or source not accessible; do not report REJECT.

## Non-goals
Exact context window telemetry without provider access; background observation of native chats; automatic pruning/compaction of ChatGPT history; silent activation of blocking gates; rewriting SIGA constitutional authority; project-specific data migration; implementing Observatory.

## Dependencies and precedence
- Canonical SIGA: `.github/skills/siga/SKILL.md` on main.
- PR #18: portable Godot authority model is draft; reference only.
- PR #19: SKR roadmap P0 and SIGA verification P1 are drafts. CG-001 is an **unprioritized proposal**, must not displace them; roadmap integration awaits reconciliation.
- SIGA Observatory PR #1: PoC, independent, optional format compatibility only.

## Success
A future authorized implementation passes the test matrix in `checklists/acceptance.md`, reports UNKNOWN where evidence is missing, and produces a handoff another session can verify independently.

## Explicit approval boundaries
M0 documentation permitted by this workstream's SIGA continuation. No activation, code changes, merge, project mutation, normative gate changes or constitutional ratification.
