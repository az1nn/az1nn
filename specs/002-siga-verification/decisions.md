# Decisions — Feature 002 SIGA verification

No synthetic user votes were created by this audit.

| ID | Topic | Choices | Outro verbatim | Resolution | Authority | Status | Provenance |
|---|---|---|---|---|---|---|---|
| SIGA-AUTO-001 | SIGA classification | Preserve exact 3 modes | — | Keep RESUME/WATCH/ADVANCE; do not add modes by reading draft PR #18 | Existing canonical SIGA | AUTO_RESOLVED (existing invariant) | `.github/skills/siga/SKILL.md` main cf2e85f |
| SIGA-AUTO-002 | Worktree isolation | Reuse SKR PR #19 | — | Persist read-only audit evidence in active draft; no duplicate PR or SIGA file edit | SIGA continuation safety | AUTO_RESOLVED | PR #19 9ddd24b |
| SIGA-G1 | Choosing scope for bare Siga when more than one workstream fits | A chat-recency; B most recent repo activity; C always ask; D auto only with one unambiguous verified target, otherwise ask | pending | OPEN; do not infer from silence | HUMAN | HUMAN_GATE | SKR SIGA 2026-10-09 |

G1 choices can be mixed with Outro free text when meaningfully compatible. Existing options or later user answer must be stored losslessly with provenance and a superseding decision rather than overwriting this row.
