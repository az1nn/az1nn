# Feature 001 — SKR: Structured Skill Grilling

Status: DRAFT FOR REVIEW (implementation proposed; no constitutional change ratified)
Date: 2026-10-09
Source of intent: user request for SKR
Target: az1nn/az1nn, canonical skills/skr/SKILL.md

## Problem / intent

Existing grilling sessions yield useful artistic/architectural decisions but too often require serial approvals and do not standardize free-text hybrid responses, verification coverage or durable conversion to Spec Kit and existing roadmaps.

## Non-goals

- Replacing SIGA, ORCHESTRATOR, INSPECTOR or domain-owner authority.
- Automatically approving constitutional/product/visual human gates.
- Changing an active project's roadmap priorities without reconciling dependencies.
- Pretending natural-language skill tests ran when only static contracts were verified.

## User stories

US1: When the user sends SKR <NOME_DA_SKILL>, the agent discovers the real tree, scopes to the focused skill and audits invocation, contracts, ownership, validations, tests, failures and handoff.
US2: Every multiple-choice grilling question offers Outro as valid free text and permits mixtures with A/B/C/D options.
US3: Once enough evidence exists, the agent makes safe, reversible, deterministic decisions in a batch and produces a compact report instead of interrupting after each.
US4: Decisions become tracked Spec Kit spec/plan/tasks/ledger and sync to the project's EXISTING roadmap with priority/dependency integrity.
US5: Visual changes get provenance-tagged visual evidence and retain the human acceptance gate.
US6: A later session resumes from the real project/head and ledger rather than restarting or trusting chat state.

## Functional requirements and acceptance criteria

| Requirement | Acceptance criteria | Verification |
|---|---|---|
| FR-01 Trigger/routing | SKR + valid name scopes to verified repository skill, including parent/sibling edges; missing name/path is explicit | T01,T02 |
| FR-02 Tree audit | Covers trigger, authority, dependencies, input/output, state, failure, verification/test and handoff; positive & negative path | T03 |
| FR-03 Outro | Every MC question has Outro; use a real multiline free-text input and independent choices when the host supports it, with text fallback otherwise. Outro-only and A+C+Outro remain valid, distinct and persisted | T04 |
| FR-04 Batch autonomy | Non-constitutional evidence-based decisions batch without repeated human interruptions; retain rationale/status | T05 |
| FR-05 Human gates | Subjective/constitutional/irreversible/explicit gates never silently APPROVED; preserve REJECT | T06 |
| FR-06 Spec Kit | Produce linked spec, plan, tasks, ledger; don't fake CLI execution or a missing constitution | T07 |
| FR-07 Roadmap sync | Update existing target roadmap preserving locked and higher-priority tasks; missing roadmap blocks COMPLETE | T08 |
| FR-08 Verification | Distinguish PASS, FAIL, NOT_RUN, NOT_APPLICABLE, STALE; include actual test/evidence provenance | T09 |
| FR-09 Resume/ownership | Check head/claims/ledger before mutation; do not duplicate sessions/decisions | T10 |
| FR-10 Routing integration | Root AGENTS and catalog route SKR to exactly one canonical file; existing SIGA/Godot untouched | T11 |

## Edge cases

- user sends only SKR; target skill ambiguous across projects;
- only Outro supplied; mixtures of options and contradictory free text;
- constitutional change suggested amid routine operational refinements;
- SKR starts from main while related skill tree is present only in open PR;
- locked roadmap, missing roadmap, stale decision ledger or competing run;
- visual image exists but live rendering not captured;
- CI unavailable or test tool failure.

## Success criteria

S1: All required files in a PR, with no duplicate SKR definition.
S2: Static contract validator passes against exact proposed HEAD.
S3: GitHub checks classified truthfully; interactive LLM end-to-end behaviors documented as pending manual exercise until performed.
S4: Spec Kit artifacts have traceable FR -> task -> test mappings and a roadmap link.
