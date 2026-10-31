# Implementation plan — Feature 001 SKR

## Implementation boundary

Repository: az1nn/az1nn. Base: main. Isolated branch: feat/001-skr-standardized-grilling.
Canonical: skills/skr/SKILL.md.
Root AGENTS.md and .github/skills/README.md are routing/indexes, not copies of SKR.

## Architecture

SKR is a portable prompting and auditing skill with read-first discovery and Spec Kit output. It is a process FACILITATOR, subordinate to SIGA and any applicable constitutional skill owners. It has no runtime service, background daemon or new independent state authority.

Flow:

~~~text
SKR <skill>
 -> SIGA state/ownership reconciliation
 -> read repo tree + focused skill/adjacent contracts
 -> audit happy path + negative paths
 -> targeted grilling (multi-select + Outro textarea when UI supports it; text fallback otherwise)
 -> grouped justified decisions | genuine HUMAN_GATE
 -> Spec Kit spec/plan/tasks/decision ledger
 -> existing roadmap sync (preserve locks/dependencies)
 -> verifications + evidence
 -> concise REPORT + SIGA handoff
~~~

## Storage

Skill logic: skills/skr/SKILL.md
Tests: skills/skr/tests/validate-skr.mjs (static contract checks; no fake agent E2E)
Scenario coverage: skills/skr/tests/scenarios.md
Feature specification: specs/001-skr-grilling/{spec,plan,tasks,decisions}.md
Skills roadmap: skills/ROADMAP.md, introduced because no prior skills roadmap was found in main (2026-10-09). Target sessions MUST use the target project's existing roadmap.

## Risks / mitigations

- Concurrent modification of skill tree PR #18: independent branch from main; no edits to PR #18 or its Godot constitution; read-only relation.
- Synthetic confidence: always label inferred vs verified; unresolved human decisions remain gates.
- Roadmap drift: update by ID, preserve locked dependencies, flag missing target roadmap.
- AI-only policy checks: static validator checks documentation/traceability; real prompt execution and CI remain distinct verification layers.
- Contract evolution: constitutional diff requires human approval rather than self-ratification.

## Verification plan

1. Node built-in static validator checks canonical location, routing, Spec Kit artifacts and mandatory protocol anchors.
2. Scenario matrix reviews Outro-only, hybrid, auto-batch, human gate, missing roadmap, stale evidence, concurrency and resumed session.
3. CI workflow runs validator when related paths change.
4. GitHub PR gates reviewed for exact head; report checks that did not run as NOT_RUN.
5. During a live SKR <skill> use case, execute runtime conversational audit and attach actual evidence/decision ledger.

No Godot runtime scene/art assets are created or modified by this feature.

## Merge-readiness validation (2026-10-31)

This is a **prompt/skill contract**, not a deployed callable agent service. GitHub Actions validates source and repository-artifact invariants, but cannot in this workflow invoke a ChatGPT-native SKR session, render host UI controls, or observe live decision capture. Do not label the 12 new repository checks as LLM E2E, nor infer official Spec Kit CLI installation from the presence of Markdown documents.

- Deterministic CI: `node skills/skr/tests/validate-skr.mjs` (29 checks) and `node skills/skr/tests/verify-release-integrity.mjs` (12 assertions), both in push and PR workflows. Validate result at **the current HEAD after every edit**.
- Manual agent/host test: use `skills/skr/tests/manual-acceptance.md` as a controlled test plan; capture actual user/agent responses and sanitized ledger output. Explicitly cover Outro-only, hybrid A+C+Outro, contradictory answers, constitutional gate, resumed session, concurrent claim rejection and responsive UI-host payload.
- GitHub merge gate: verified HEAD, compare against main, CI complete, human/domain/constitutional approvals where necessary, T13/T17 evidence independently reviewed. Until then keep PR draft and **do not merge**.
- Keep PR #18 portable Godot constitution independent; canonical SIGA mode contract remains RESUME/WATCH/ADVANCE.
