---
name: skr
version: "0.1.0"
description: Spec Kit-first structured grilling and end-to-end verification audit of a focused skill in its real skill tree.
canonical_source: "skills/skr/SKILL.md"
owner: "process-facilitator"
storage_policy: "repository-only-for-operational-state"
---

# SKR — Structured Skill Grilling

## Contract

Trigger: SKR <NOME_DA_SKILL> (case-insensitive, with optional project/repository qualifier).

SKR is a SHORTCUT for structured grilling of an actual skill tree, focused on the named skill. It discovers and audits the full invocation/verification/test flow and produces Spec Kit-compatible decisions, specification changes, roadmap linkage and a compact evidence-backed report. It is NOT another orchestrator, domain authority, approver or implementation bypass.

If the skill name is ambiguous, inspect the current repository, canonical catalog and target project before asking one essential clarifying question. A bare SKR may offer the discovered skill inventory. Never invent a missing skill or treat an open PR as merged.

### Authority and composition

- SIGA owns real-state reconciliation, continuation (RESUME/WATCH/ADVANCE), mutation scope, conflicts, gates and handoff.
- ORCHESTRATOR, when the portable game tree exists in the checked-out ref, owns its constitutional process authority; domain owners retain their own decisions.
- SKR owns interview format, decision capture, traceability, coverage audit and proposal packaging only.
- INSPECTOR or equivalent owns objective verification; ART/DESIGN/LORE/ARCH and human gates retain their defined authority.
- Changes to skill-tree constitution, authority, gate semantics or topology are PROPOSALS until expressly approved by the human. SKR cannot self-ratify them.
- Source precedence: runtime/evidence/code + repository/current ref > persisted handoff > chat. Read applicable project constitution before proposing any policy change.
- Never duplicate the canonical SIGA definition; load the repository's existing SIGA.

## Operating protocol

### 0. RECONCILE / IDENTIFY

1. Resolve repository, branch, exact HEAD, project, named focus skill and scope.
2. Read canonical skill catalog, root agent instructions, target SKILL.md, parent constitution and immediate dependencies/callers; use actual checked-out files. Look for open PRs and pending implementations, not just main.
3. Locate current Spec Kit constitution, specs, plans, tasks and roadmap. Find prior grilling decision ledger, human gates, rejects, accepted baselines, claims/ownership and evidence.
4. If two sessions may mutate overlapping logical resources, defer claim reconciliation to SIGA; do not mutate without ownership.
5. If source or tool access is absent, mark UNVERIFIED rather than fabricate a pass.

### 1. AUDIT THE WHOLE TREE, FOCUS THE NAMED SKILL

Produce a compact coverage matrix for the target and its entry/exit edges:

| Edge / area | Required examination |
|---|---|
| Invocation | trigger recognition, routing and precedence |
| Authority | owner vs executor, allowed decisions and prohibited actions |
| Inputs | preconditions, schemas, defaults, missing/invalid states |
| Dependencies | upstream/downstream calls and cross-skill contracts |
| State | persistence, idempotence, concurrency, RESUME/WATCH/ADVANCE |
| Execution | success path, retries, failure taxonomy, scope expansion |
| Verification | AC -> test/evidence -> reviewer/owner -> result |
| Human gates | aesthetic, product, constitutional, destructive, cost or explicit approvals |
| Observability | version/HEAD, provenance, screenshots/video where useful |
| Delivery | Spec Kit artifacts, roadmap, PR/CI and resumable handoff |

Trace a concrete happy path AND at least one negative path: missing skill, ambiguous input, contradictory choices, rejected evidence, tool/environment failure, stale HEAD, concurrent ownership or human gate. Distinguish NOT_APPLICABLE from NOT_TESTED. Do not claim an end-to-end runtime PASS from document inspection alone.

### 2. GRILL EFFICIENTLY

Use focused questions only where unresolved choices materially change the resulting spec, ownership, priority or validation. Prefer 3–5 clear choices, with the best grounded default identified when appropriate.

EVERY multiple-choice question MUST offer the final option:

Outro: [campo de texto livre — pode combinar A/B/C/... e descrever ajustes]

The Outro answer is fully valid by itself; it does NOT invalidate other options. Accept hybrid answers (e.g. A + C + Outro: ...). Store selected options and free-text additions separately; combine compatible constraints and preserve dissent/ambiguity. If options conflict, reconcile deterministically when safe; escalate only genuine human decisions. Never drop free text because the answer also selected a listed choice.

#### Input UI adapter

- When a host supports interactive inputs, render listed alternatives as independent checkboxes/multi-select plus a visible **Outro multiline text input/textarea** in the same question; submit selected choices and exact free text as one payload. Never use exclusive radio-only controls that block mixed answers.
- Outro alone, a listed choice alone, or A + C + Outro are all valid. Input is valid if at least one listed option is chosen OR nonblank Outro is provided. An unused Outro field must not invalidate listed choices; typing in Outro must not require checking an extra toggle.
- Preserve verbatim Outro separately from normalized meaning. Handle contradictory mixes after submission as decision conflicts, not as an invalid question. Never discard free text.
- On hosts without interactive controls, use text fallback `Outro: <texto livre>` and accept free-text-only and hybrid answers. Never claim a native field exists where one was not displayed.

Questions are not automatically one-per-turn:
- Inspect already-approved G1..Gn and do not ask them again.
- Once information is sufficient, take safe, justified operational decisions in a BATCH; do not stop to ask approval after every item.
- Auto-resolve only deterministic, reversible, non-constitutional decisions supported by existing specs, evidence or clear user preferences. Label them AUTO_RESOLVED and cite the basis.
- Mark recommendations that alter subjective direction, constitutional authority, irreversible outcomes or explicit human gates as PROPOSED / HUMAN_GATE; never silently promote them to APPROVED.
- If data is insufficient for a non-critical detail, state an assumption and record it as OPEN, or ask one blocking question.
- If the user says 'responda sozinho', maximize justified batch decisions while honoring human gates.
- Preserve stable G-number IDs, prior approvals, rejects and provenance across sessions. No answer can retroactively mutate a previous decision unnoticed.

Recommended question format:

~~~text
SKR <SKILL> — G7: <concrete decision + why it matters>
A) ...
B) ...
C) ...
D) ...
Outro: [texto livre; também pode usar A + C + Outro: ...]
Recomendação: B, porque <evidence>. Se não for human gate, resolva em lote.
~~~

### 3. SPEC KIT IS MANDATORY

Never end a grilling session at a conversational summary. In the TARGET repository:

1. Load its existing constitution and Spec Kit workflow. Follow the project's existing layouts and command integration; use installed specify/speckit commands when available. Do not claim a CLI command was executed unless it was.
2. Maintain or create a feature unit with spec.md (intent/FR/AC/edge cases), plan.md (design, owners, dependencies, risks/gates), tasks.md (prioritized dependencies and verifiable tests); use checklist/analyze/converge when supported. The seed can be refined by appropriate domain owners.
3. Create/append an immutable-attribution decision ledger: ID, options, free text, resolution, authority, source, status, acceptance impact, date/ref.
4. Cross-link each requirement to acceptance criteria, tasks and tests/evidence. Record OPEN questions and constitutional proposals without assuming approval.
5. Reconcile with the TARGET's EXISTING roadmap; insert or update the feature at the proper dependency/priority position. Respect existing locks, active work and owner priorities. Do not create a competing roadmap, reorder unrelated work, or declare roadmap sync if no roadmap was found. Mark ROADMAP_MISSING and hold closure until resolved.
6. Persist artifacts on a conflict-safe branch/PR under SIGA's ownership rules; do not silently merge or deploy.

A session is COMPLETE only when spec/plan/tasks/ledger are coherent, roadmap linkage is verified, applicable checks have evidence, and no required human gate is pending. Otherwise state PARTIAL / BLOCKED with exact missing item.

### 4. VERIFY FIRST, THEN REPORT

Select checks from the target's real validation entry points:

- static/schema/contract checks, lint and type checks if applicable;
- focused unit/integration tests on each changed behavior;
- end-to-end invocation -> routed skill -> output -> verification -> handoff;
- negative paths and regressions, including failures/retries/conflicts;
- exact-HEAD CI/build checks where provided;
- visual evidence (one current, versioned screenshot/image/video) if presentation or runtime visuals matter;
- domain-owner acceptance and required HUMAN approval where explicitly reserved.

Report NOT_RUN or UNAVAILABLE for checks you could not execute. Existing evidence from another revision is STALE, not fresh verification.

Output in this order:

~~~text
SKR REPORT
TARGET / REPO / HEAD:
MODE / SCOPE:
AUDIT: PASS | PARTIAL | FAIL | NOT_RUN  (per tree edge)
DECISIONS: G# -> choice(s) + Outro, AUTO_RESOLVED | APPROVED | OPEN | HUMAN_GATE
SPEC KIT: spec / plan / tasks / ledger / analyze (paths & statuses)
ROADMAP: path / priority / dependency / sync result
VERIFY: checks + evidence ref / NOT_RUN / FAIL / PASS
GATES / REJECTS / RISKS:
NEXT: single highest-priority executable step
SIGA HANDOFF: canonical location / needed follow-up
~~~

No manufactured evidence, no erased REJECT, no claimed merged state without checking GitHub. A visual mockup is a PROPOSAL until accepted; runtime evidence is separate from illustration.

## Compact resume rule

When invoked again for the same skill, first reconcile decision ledger, existing spec/task/roadmap and HEAD. Continue from the first unresolved material issue. Do not restart G1 or create duplicate specs/branches.

## Failure handling

- Missing repo/skill -> BLOCKED_DISCOVERY, show exact absent path.
- Missing Spec Kit workflow -> SPEC_KIT_SETUP_REQUIRED, preserve draft artifacts; do not falsely claim official CLI integration.
- Missing roadmap -> ROADMAP_MISSING, no final COMPLETE.
- Conflicting answers -> DECISION_CONFLICT; record both and ask only if authority requires it.
- Tool/CI broken -> TOOL_FAILURE / ENV_FAILURE, not FEATURE_FAILURE by default.
- Acceptance criteria fail -> REJECT; retain negative evidence.
- Evidence absent -> INSUFFICIENT_EVIDENCE, not REJECT.
- Constitutional change -> HUMAN_GATE with precise diff and authority consequences.
