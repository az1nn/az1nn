# SPEC-CG-001 — SIGA Context Guardian

Status: **PROPOSED — M0 DOCUMENTATION ONLY**  
Date: 2026-10-29  
Owner: SIGA process authority (integration proposal)  
Documentary location: `.github/skills/siga/context-guardian.md` (M03=A; SIGA-internal documentation only)  
Future runtime owner: canonical SIGA at `.github/skills/siga/SKILL.md` (separate authorization required)

## Problem
Long ChatGPT-native sessions may no longer expose all earlier constraints, decisions and evidence. In the native chat there is no reliable API-free readout of the model's actual context-window size, currently retained token count or compaction events. SIGA must preserve continuity without inventing telemetry, re-deciding approved choices or mistaking a summary for canonical project truth.

## CG-007 review
CG-O01–CG-O05 are **approved design decisions**; ADR-CG-002 is **approved at documentation level**. ADR-CG-001 has been **published documentarily via PR #21** (no constitutional ratification), with the directive that Context Guardian and SIGA are one, not separate executable skills. No constitutional ratification, merge or M1 implementation is authorized.

## User stories
1. As SIGA (not as a separate Guardian agent or skill), on an explicit invocation, I can assess the **available sample** and expose its known coverage limits.
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
| CG-FR11 | Unified SIGA ownership | Context, decisions and handoff diagnostics are proposed **inside existing SIGA**. No second invocable skill, agent or orchestrator; documentation location is not runtime registration. ADR-CG-001 has documentary publication in main; constitutional impact and any executable change remain gated. |

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
- Canonical SIGA: `.github/skills/siga/SKILL.md` on main; this is the sole proposed future runtime integration point, not modified in M0.
- M02=A / M03=A: eight remaining M0 documents reconciled against main ADRs; SIGA design document now under `.github/skills/siga/`, not an independent skill.
- CG-O01=A ledger by owning project; CG-O02=A audit at SIGA invocation/handoff; CG-O03=A Intelligent UI + Markdown; CG-O04=A advisory signals only with existing gates; CG-O05=A preserve SKR P0 / SIGA P1 roadmap.
- PR #18: portable Godot authority model is draft; reference only.
- PR #19: SKR roadmap P0 and SIGA verification P1 are drafts. CG-001 is an **unprioritized proposal**, must not displace them; roadmap integration awaits reconciliation.
- SIGA Observatory PR #1: PoC, independent, optional format compatibility only.

## Success
A future authorized implementation passes the test matrix in `checklists/acceptance.md`, reports UNKNOWN where evidence is missing, and produces a handoff another session can verify independently.

## Explicit approval boundaries
M0 documentation and CG-007/CG-008 decision recording only. ADR-CG-001 is published as documentation; no constitutional approval follows. No activation, code changes, merge, project mutation, normative gate changes, constitutional ratification or M1 implementation.
