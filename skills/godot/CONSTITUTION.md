# Constitution — Portable Godot Skill Tree

> Status: WORKING DRAFT — contains only rules approved or directly derived during the grilling session. Unresolved structural decisions must not be silently filled in.

## 1. Authority model

```text
ORCHESTRATOR = authority over process
DOMAIN OWNER = authority over its domain
HUMAN        = authority over explicitly reserved decisions
```

The Orchestrator cannot convert a domain owner's `REJECT` into `ACCEPT`.

Allowed response to a domain rejection:

```text
retry
request new evidence
route a correction
invoke another applicable owner
resolve DOMAIN_CONFLICT
escalate HUMAN_GATE
```

## 2. Validation vs operational closure

`INSPECTOR` has authority to establish evidence-based validation state.

`ORCHESTRATOR` records operational closure after required gates are satisfied.

```text
feature_status: VALIDATED
operational_status: CLOSED
```

The Orchestrator cannot manufacture technical `DONE` without validation.

## 3. Inspector scope

The Inspector validates explicit acceptance criteria and global critical invariants.

It may:

- verify runtime behavior;
- compare evidence with acceptance criteria;
- identify regressions;
- declare insufficient evidence;
- return ACCEPT / REJECT where criteria are objective;
- emit FINDING or CRITICAL_FINDING.

It may not:

- invent acceptance criteria;
- reject by personal taste;
- redefine art direction;
- redefine game design;
- redefine lore;
- become the architecture owner.

Subjective criteria route to the corresponding owner or human gate.

## 4. Acceptance criteria and spec gaps

```text
BUG      = implementation diverges from the spec
SPEC_GAP = spec does not define enough behavior
```

A specialist may detect and propose a spec change.

Only DESIGN or the formal spec owner may incorporate new acceptance criteria.

The Orchestrator coordinates the return to the spec owner but does not author domain intent by convenience.

## 5. Findings

Three distinct outcomes:

```text
REJECT
  acceptance criterion failed

CRITICAL_FINDING
  spec may pass, but a constitutional critical invariant is violated

FINDING
  non-blocking issue outside current acceptance criteria
```

Initial CRITICAL_FINDING categories:

- data loss;
- data corruption;
- security exposure;
- deterministic crash;
- destructive irreversible behavior;
- broken core runtime;
- explicit global invariant violation.

The Inspector may emit a critical finding only from predeclared categories. It cannot expand the category set ad hoc.

## 6. Domain conflict

When two valid domain authorities conflict, neither silently overrides the other.

```text
DOMAIN_CONFLICT
  owner_a
  constraint_a
  owner_b
  constraint_b
  shared_resource
```

Resolution routes:

```text
compatible_change
spec_revision
human_gate
```

The Orchestrator coordinates the conflict but does not decide domain content itself.

## 7. Concurrency and ownership

Use hybrid locking.

Primary mechanism: logical resource ownership.

Secondary operational evidence:

- branch;
- worktree;
- files touched;
- spec;
- task;
- execution state.

Execution claim:

```yaml
execution_id:
scope:
logical_resources: []
spec:
task:
branch:
worktree:
files_touched: []
state:
```

Logical overlap is an ownership conflict even when files differ.

Physical file overlap without logical overlap requires reconciliation before write/merge.

## 8. Scope expansion

A specialist may discover additional required work but may not silently claim it.

```text
SPECIALIST
  -> SCOPE_EXPANSION_REQUEST
  -> ORCHESTRATOR
  -> RECONCILE OWNERSHIP
  -> GRANT | SPLIT | BLOCK
```

Discovering work is allowed. Appropriating it without reconciliation is not.

## 9. Ownership lifecycle

Ownership does not expire merely because time passed.

States:

```text
ACTIVE
RELEASED
STALE_CLAIM
RECOVERED
```

Recovery requires liveness reconciliation.

```text
ACTIVE    -> keep ownership
DEAD      -> RECOVERED
AMBIGUOUS -> STALE_CLAIM
```

A `STALE_CLAIM` cannot be overwritten automatically.

## 10. Execution loops

Repeated work without semantic progress becomes `EXECUTION_LOOP`.

Typical classification:

```text
SPEC_GAP
DOMAIN_CONFLICT
IMPOSSIBLE_CONSTRAINT
IMPLEMENTATION_DEFECT
HUMAN_GATE
```

Loop detection is based on repeated decisions/constraints without material new information, not merely a fixed retry counter.

## 11. Evidence rules

Retry does not erase previous evidence or rejection history.

Relevant evidence must retain provenance sufficient to identify:

- execution;
- target;
- criterion;
- source;
- revision/head where applicable;
- capture/validation context.

A material change invalidates dependent validation and triggers only the affected revalidation.

Absence of evidence is not rejection:

```text
INSUFFICIENT_EVIDENCE != REJECT
```

## 12. Failure taxonomy

At minimum distinguish:

```text
TOOL_FAILURE
ENV_FAILURE
VALIDATION_FAILURE
FEATURE_FAILURE
```

A broken validation tool must not be reported as a broken feature without evidence.

## 13. Owner and executor

Domain owner is executor by default.

A domain owner may directly mutate resources inside its authority.

Cross-domain execution is allowed, but authority follows impact, not authorship.

Example:

```text
ART defines visual intent
ARCH implements shader
ART approves visual result
ARCH approves technical integrity
INSPECTOR verifies evidence
```

A cross-domain change must declare affected domains.

## 14. Multi-domain completion

A feature may reach `VALIDATED` only when all applicable conditions hold:

- required acceptance criteria pass;
- mandatory domain approvals exist;
- no CRITICAL_FINDING remains open;
- no DOMAIN_CONFLICT remains open;
- no required evidence is missing.

Each task/spec has one primary owner even when several secondary owners must approve.

## 15. DESIGN and LORE are separate authorities

DESIGN owns:

- gameplay mechanics;
- rules;
- systems;
- economy;
- progression;
- intended player experience.

LORE owns:

- fictional canon;
- worldbuilding;
- narrative;
- characters;
- setting coherence.

Neither silently overrides the other.

## 16. ARCH is a first-class authority

ARCH owns technical implementation integrity, including:

- code architecture;
- structural quality;
- dependencies;
- internal APIs;
- persistence;
- networking;
- security;
- refactors;
- test architecture;
- technical performance constraints;
- engine-level systems.

ARCH does not redefine gameplay, lore, scene composition or visual intent.

## 17. Runtime is not an authority

Runtime/build is an execution substrate and source of evidence. It does not own decisions.

## 18. Reporter constraints

REPORTER has no decision power.

It must reflect actual post-execution state and may not:

- convert PARTIAL into DONE;
- omit rejects;
- resolve conflicts;
- manufacture evidence.

A handoff must be resumable without relying on the previous chat/session.

## 19. Verify-first

Before new mutation:

1. inspect current reality;
2. inspect pending work;
3. inspect gates;
4. inspect prior execution/evidence;
5. inspect ownership/conflicts;
6. then mutate.

Runtime/evidence outrank stale declarations.

## 20. Human gates

Human gate is an exception, reserved for genuinely human decisions such as:

- subjective aesthetic approval;
- significant scope change;
- irreversible choice;
- product-direction trade-off;
- external cost;
- publication;
- credentials;
- explicitly reserved subjective decisions.

Do not create a human gate for deterministic automation such as tests, builds, logs, branch creation, documentation updates or deterministic fixes.

## 21. Handoff contract

Every relevant execution ends with explicit state.

Minimum call contract:

```yaml
caller:
skill:
objective:
inputs:
constraints:
expected_output:
acceptance_criteria:
human_gate:
```

Minimum result contract:

```yaml
status: success | rejected | blocked | partial
evidence:
changes:
risks:
next_action:
```

## 22. State precedence

When sources disagree:

```text
runtime
> evidence
> code
> declared state
> old report
> chat/model memory
```

## 23. Orchestration multiplicity

There is one orchestration authority/protocol, not one mandatory running process.

Multiple Orchestrator instances may execute concurrently, but every instance must operate over the same canonical project truth and shared ownership model.

```text
ONE ORCHESTRATION PROTOCOL
ONE CANONICAL STATE
ONE CLAIM REGISTRY
MANY EXECUTION INSTANCES
```

Each active instance must have an explicit execution identity and enough state to reconcile independently:

```yaml
execution_id:
scope:
claims: []
branch:
worktree:
task:
spec:
state:
last_reconcile:
```

No instance may assume it is the only active coordinator.

Before mutation, an instance must reconcile canonical state and acquire the required logical claims.

## 24. Derived orchestration invariants

- canonical project state is shared across Orchestrator instances;
- a claim belongs to an execution, not generically to a skill;
- no hidden chat/session state grants operational authority;
- RESUME always revalidates branch/head, claims, spec, evidence and gates;
- WATCH is non-mutating by default and must be reclassified before mutation;
- ADVANCE requires eligible work with no unresolved dependency, conflict or gate;
- BLOCKED must name its cause;
- HUMAN_GATE must name the exact missing human decision;
- silence, timeout or missing response never imply ACCEPT;
- rejected candidates remain traceable but cannot become baseline automatically.
