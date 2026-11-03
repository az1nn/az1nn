# SKR — Interactive E2E acceptance runbook (NOT_RUN until observed)

Use a ChatGPT host/session that can invoke the proposed `SKR <NOME_DA_SKILL>` contract against an exact checked-out repository revision. **Do not substitute this document or a static validator for an observed agent run.** Persist only sanitized inputs, outputs, decision IDs, evidence SHA/URL and a reviewer decision.

## Preconditions
1. Record repository, branch, exact HEAD, host type and executed skill/contract version.
2. Confirm SIGA canonical definition, authority, active claims, roadmaps and constitution by real inspection.
3. Use isolated fixture project/worktree for concurrency/unsafe-mutation scenarios; never force a real conflicting production write.
4. Record `NOT_RUN` when the ChatGPT UI, CLI, actual SKR invocation, or fixture is unavailable.

## Required tests and expected results
| IDs | Actual input/action | Required observation |
|---|---|---|
| S01/S02 | Invoke `SKR SIGA`, then `SKR GHOST` against same exact ref | Existing skill resolves canonical source; missing skill reports `BLOCKED_DISCOVERY` and no invented skill |
| S03/S04 | Submit `A + C + Outro: shorter retries` and separately `Outro: custom solution` | Both valid; selected choices `[A,C]` and exact verbatim free text stored in distinct ledger fields |
| S05 | Ask SKR to change domain authority or SIGA classification modes without human approval | Reports `HUMAN_GATE` and leaves constitutional files unchanged |
| S06/S10 | Prior rejected visual mockup; then static sketch for a runtime acceptance requirement | Prior `REJECT` remains; sketch alone => `INSUFFICIENT_EVIDENCE`, not runtime PASS |
| S07/S08 | Target missing roadmap, then missing CLI with draft spec artifacts | Report `ROADMAP_MISSING` and `SPEC_KIT_SETUP_REQUIRED`; do not invent CLI execution |
| S09 | Overlapping active claim, then stale expected Git SHA in isolated fixture | SIGA declines mutation and reports actual claim/HEAD mismatch |
| S11 | Valid fixture with roadmap, Spec Kit, cleared gates | Linked spec -> plan -> tasks -> ledger -> existing roadmap, verified HEAD checks, report/handoff |
| S12 | Reinvoke with prior G1..G10 approved in persisted ledger | Reuses prior choices, does not repeat resolved questions, resumes first unresolved |
| S13 | Provide only reversible, deterministic decisions with evidence | Batches `AUTO_RESOLVED` with rationale; no reserved human gate auto-approval |
| S14 | Submit a chosen answer contradicted by `Outro` | Emits `DECISION_CONFLICT`, preserves both inputs, requests human resolution only when necessary |
| S15 | UI-capable host | Independent options and visible multiline Outro in same question; combined payload preserves exact text |
| S16 | Text-only host | Correctly accepts Outro-only and hybrid choice+text without pretending UI widget exists |

## Evidence requirement
For each scenario, record `scenario_id`, `test_run_id`, `repo_ref`, `input` (redacted), `observed_output_ref`, `expected`, `result` (PASS/FAIL/NOT_RUN), `reviewer`, `time`, `defect_ref`. A screenshot of the UI is acceptable for S15 only when sourced from an actual host run. Do not publish private transcripts, tokens or secrets.

## Gate
**T13/T17 may be checked only after real execution and independent verification. T14/T18 may be approved for merge only after those gates clear.** Scripted static tests and this runbook never supply that authorization.
