# Context Guardian — capability proposal (NOT ACTIVE)

Status: **DRAFT / M0 DOCUMENTATION ONLY**. This is not an installed, callable skill. No SKILL.md, runtime, API client, continuous monitor, or trigger is registered by this change.

## Purpose
A portable SIGA capability for (1) context-risk signaling, (2) decision integrity and (3) durable handoff validation in native ChatGPT sessions **without OpenAI API**.

## Authority
- SIGA remains the only orchestration/process authority, defined on main at `.github/skills/siga/SKILL.md`.
- The Guardian is an advisory verifier, not a second orchestrator, domain owner, or autonomous decision-maker.
- Proposed signals never by themselves grant or revoke authority to execute, merge, publish or override domain decisions.
- INSPECTOR validates explicit invariants and evidence. REPORTER presents verified resumable state. Neither gains decision authority.
- Constitutional changes, including mandatory blocking semantics or skill authority/topology changes, require explicit human ratification.

## Capability boundaries
- No access to internal context-window size, active token count, hidden reasoning, truncation or compaction events in native ChatGPT.
- No unrequested export, capture, or automatic monitoring of all chats.
- An invocation can assess the visible/provided segment, verified repository state and a versioned handoff. It cannot guarantee information absent from current context.
- Exact local text counts are distinct from token heuristics. **Never display a heuristic as a percentage of actual context-window usage.**
- No public GitHub storage of full chat transcripts or private/sensitive user data. Only sanitized decision IDs, references and summaries with provenance; project-specific operational data stays at its owning source.

## Integration proposal
`RECONCILE -> [context/decision check] -> CLASSIFY -> EXECUTE -> VERIFY -> [decision + handoff check] -> HANDOFF`

Brackets denote internal inspections, not new SIGA classification modes or mandatory gates.

## Related work (do not modify in M0)
- PR #18 portable Godot tree: https://github.com/az1nn/az1nn/pull/18 (draft; not merged).
- PR #19 SKR + proposed skills roadmap: https://github.com/az1nn/az1nn/pull/19 (draft; not merged).
- Observatory PR #1: https://github.com/az1nn/siga-orquestrator/pull/1 — PoC / future plans only; no required dependency.

Specification: [SPEC-CG-001](../../specs/CG-001-context-guardian/spec.md).
