# SIGA Context Guardian — internal capability proposal (NOT ACTIVE)

Status: **DRAFT / M0 DOCUMENTATION ONLY**. This file resides beside SIGA's canonical skill as **documentation only**, not an installed/callable skill. No SKILL.md, runtime, API client, continuous monitor, or trigger is registered. **CG-007:** the user directed that Context Guardian and SIGA must be **one**; the canonical future runtime owner is SIGA, not a separately callable Guardian.

## Purpose
An internal, portable **SIGA behavior** for (1) context-risk signaling, (2) decision integrity and (3) durable handoff validation in native ChatGPT sessions **without OpenAI API**.

## Authority
- SIGA remains the only orchestration/process authority, defined on main at `.github/skills/siga/SKILL.md`.
- Context Guardian names a SIGA-internal group of advisory checks, **not an independent skill, module with authority, agent, domain owner or autonomous decision-maker**. ADR-CG-001 was subsequently **published documentarily** via PR #21. Runtime/constitutional authority still requires separate approval.
- Proposed signals never by themselves grant or revoke authority to execute, merge, publish or override domain decisions.
- INSPECTOR validates explicit invariants and evidence. REPORTER presents verified resumable state. Neither gains decision authority.
- Constitutional changes, including mandatory blocking semantics or skill authority/topology changes, require explicit human ratification.

## Capability boundaries
- No access to internal context-window size, active token count, hidden reasoning, truncation or compaction events in native ChatGPT.
- No unrequested export, capture, or automatic monitoring of all chats.
- An invocation can assess the visible/provided segment, verified repository state and a versioned handoff. It cannot guarantee information absent from current context.
- Exact local text counts are distinct from token heuristics. **Never display a heuristic as a percentage of actual context-window usage.**
- No public GitHub storage of full chat transcripts or private/sensitive user data. Only sanitized decision IDs, references and summaries with provenance; project-specific operational data stays at its owning source.

## CG-007 approved design choices
- CG-O01=A: keep decision ledger in the owning project with portable cross-project references.
- CG-O02=A: SIGA checks context/decisions on each explicit invocation and meaningful handoff (future behavior, not active).
- CG-O03=A: Intelligent UI when supported, full Markdown fallback; durable state in canonical project sources.
- CG-O04=A: advisory alerts; only already authorized gates may block.
- CG-O05=A: preserve SKR P0 and SIGA P1; roadmap integration awaits reconciliation.
- ADR-CG-002=A: documentary approval for provenance and handoff.
- ADR-CG-001=B: historical revision followed by conditional **documentary publication in PR #21**; no constitutional ratification.

## Integration proposal
`RECONCILE -> [context/decision check] -> CLASSIFY -> EXECUTE -> VERIFY -> [decision + handoff check] -> HANDOFF`

Brackets denote **SIGA's own** internal inspections, not new skills, SIGA classification modes or mandatory gates. No runtime code changes in this PR. This file is an internal SIGA design reference, **not** a new callable skill or operational trigger.

## Related work (do not modify in M0)
- PR #18 portable Godot tree: https://github.com/az1nn/az1nn/pull/18 (draft; not merged).
- PR #19 SKR + proposed skills roadmap: https://github.com/az1nn/az1nn/pull/19 (draft; not merged).
- Observatory PR #1: https://github.com/az1nn/siga-orquestrator/pull/1 — PoC / future plans only; no required dependency.

Specification: [SPEC-CG-001](../../../specs/CG-001-context-guardian/spec.md).

## CG-008 (M02=A / M03=A)
- This document was moved from `skills/context-guardian/README.md` into the canonical SIGA documentation directory.
- The underlying SIGA `SKILL.md` is unchanged. No Guardian runtime registration is permitted by this move.
- All eight remaining M0 files are documentary only; the two ADRs were already published to main via PR #21.
