# Decisions — Feature 002 SIGA verification

No synthetic user votes were created by this audit.

| ID | Topic | Choices | Outro verbatim | Resolution | Authority | Status | Provenance |
|---|---|---|---|---|---|---|---|
| SIGA-AUTO-001 | SIGA classification | Preserve exact 3 modes | — | Keep RESUME/WATCH/ADVANCE; do not add modes by reading draft PR #18 | Existing canonical SIGA | AUTO_RESOLVED (existing invariant) | `.github/skills/siga/SKILL.md` main cf2e85f |
| SIGA-AUTO-002 | Worktree isolation | Reuse SKR PR #19 | — | Persist read-only audit evidence in active draft; no duplicate PR or SIGA file edit | SIGA continuation safety | AUTO_RESOLVED | PR #19 9ddd24b |
| SIGA-G1 | Choosing scope for bare Siga when more than one workstream fits | A chat-recency; B most recent repo activity; C always ask; **D selected**: auto only with one unambiguous verified target, otherwise ask | none | **D APPROVED**; never mutate an ambiguous target; record candidates and evidence before asking | HUMAN | APPROVED 2026-10-09 | User explicit: `SKR SIGA — G1: escolho D` |

G1 choices can be mixed with Outro free text when meaningfully compatible. Existing options or later user answer must be stored losslessly with provenance and a superseding decision rather than overwriting this row.

## G1 execution interpretation
- With exactly one independently verified eligible target, continue using existing SIGA classification.
- With zero or multiple plausible targets, do not select from chat recency or latest commit; request one essential scope decision before any mutation.
- Reconcile again after the answer; a previously unique target may have changed.
- This approves scope selection policy only, not any constitutional merge or domain approval.
