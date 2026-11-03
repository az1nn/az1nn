# Implementation plan — Feature 002 SIGA verification

## Safe boundary
Keep `.github/skills/siga/SKILL.md` intact pending human G1 and any constitutional approval. Develop validation and evidence in a later scoped feature after P0 SKR PR #19 gates. PR #18's proposed portable Godot ORCHESTRATOR is separately owned and not merged.

## Design
- Discovery adapter resolves root `AGENTS.md` -> canonical SIGA path; check live ref.
- A scenario fixture set models repository status with `HEAD`, PRs, CI, active claims and explicit gates. Contract tests assert classification selection and forbidden unsafe mutation in negative cases.
- Natural-language LLM agent behavior must be tested in a real invocation; static text assertions are not enough. Separate static, integration, behavioral and visual checks.
- Scope arbitration is a human-authority choice G1; write policy only after user's response.
- If an orchestrator is present, a compatibility adapter records auxiliary BLOCKED/HUMAN_GATE without expanding SIGA's exact 3-mode classification unless explicitly ratified.
- Persist evidence with execution identity, source ref, observed outputs, expected outcomes and provenance; classify FAIL vs NOT_RUN vs STALE accurately.

## Validation plan
1. Static canonical-path checks; no duplicate definitions.
2. RESUME: interrupted task resumes same unit.
3. WATCH: active CI/worker prevents parallel duplicate.
4. ADVANCE: validated prior task + eligible roadmap item advances only once.
5. Ambiguous project -> no unsafe side effects.
6. Stale HEAD/overlapping resource claim -> hard stop and new reconcile.
7. Human gate and visual REJECT remain untouched.
8. Human-reviewed agent-run E2E with real repo tools, including handoff/reentry.
9. Spec Kit `spec/plan/tasks/decisions` and existing roadmap traceability checks.
10. Exact-head GitHub CI, with any unavailable checks marked NOT_RUN.

## Risks
- Parallel PR #18 has independent constitution; scope owner conflicts handled through SIGA claims.
- No top-level Spec Kit CLI setup observed; do not claim CLI execution. Use Markdown artifact model and mark official CLI verification NOT_RUN.
- Repo has no SIGA-specific executable test suite on main at audit time; report coverage gap until added.
