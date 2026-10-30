# Context Guardian — proposed contracts v0 (non-executable)

All field names and examples are **proposal**, not deployed schema. Future implementation must validate contracts with automated fixtures. **CG-007:** the contract is a prospective **SIGA-internal** assessment/decision/handoff data shape, not an independent Context Guardian service or callable skill. ADR-CG-001 and ADR-CG-002 were published **documentarily** via PR #21; no constitutional ratification or implementation authorization.

## A. Assessment

```json
{
  "schema_version": "0.1.0-proposal",
  "assessment_id": "cg-example-001",
  "observed_at": "2026-10-29T00:00:00-03:00",
  "input": {
    "source_type": "user_supplied_text",
    "sample_scope": "excerpt",
    "coverage": "PARTIAL",
    "characters": {"value": 12000, "kind": "MEASURED_SAMPLE"},
    "tokens": {"lower": 2400, "upper": 4800, "kind": "HEURISTIC", "method": "sample_chars_div_5_to_2_5"},
    "actual_context_window_usage": {"kind": "UNAVAILABLE", "value": null}
  },
  "signals": [
    {"code": "CONTEXT_UNOBSERVABLE", "severity": "INFO", "evidence": "native_chat_no_provider_telemetry"}
  ]
}
```

The values above are **fictional fixture data**, not measurements of any real chat. A `COMPLETE_SAMPLE` is not complete context window coverage.

## B. DecisionRecord

```json
{
  "schema_version": "0.1.0-proposal",
  "decision_id": "CG-D01",
  "revision": 1,
  "state": "PROPOSED",
  "authority": "USER",
  "scope": "context-guardian",
  "summary": "Guardian integrates with SIGA, not Observatory",
  "evidence_refs": ["specs/CG-001-context-guardian/decisions.md"],
  "supersedes": null,
  "verified_at": null
}
```

Permitted `state`: `PROPOSED`, `APPROVED`, `REJECTED`, `SUPERSEDED`. Human approval evidence must be explicit; unavailability implies `PROPOSED/UNKNOWN`, never `APPROVED`.

## C. Optional handoff extension
Do not replace the canonical CAVEMAN HANDOFF v1. Add an optional **SIGA-owned** section or a namespaced `context_guardian` object to an envelope if supported. The namespace describes data, **not a second authority, subsystem or skill**.

```json
{
  "context_guardian": {
    "schema_version": "0.1.0-proposal",
    "assessment_ref": "cg-example-001",
    "coverage": "PARTIAL",
    "actual_window_usage": "UNAVAILABLE",
    "decision_refs": ["CG-D01", "CG-D03"],
    "signals": ["CONTEXT_UNOBSERVABLE"],
    "restrictions": ["verify_real_state", "no_implicit_merge"],
    "handoff_validity": "PENDING_RECONCILIATION"
  }
}
```

On resume verify repository/ref/HEAD, ownership claims and domain approvals **before** trusting this extension. Record missing evidence as `UNKNOWN` or `INSUFFICIENT_EVIDENCE` rather than `REJECT`.

## D. Signal interface

`signal = {code, severity: INFO|WARNING|CRITICAL, observed_at, source_ref, evidence, suggested_action, blocking: false}`

A `CRITICAL` severity is a UI urgency suggestion and **does not itself constitute** an INSPECTOR `CRITICAL_FINDING` or execution block. Such transitions require independently existing validated criteria and authority.

## CG-007 scope and governance
- CG-O01=A: decision records belong to the owning project; references can span projects without duplicating private data.
- CG-O02=A: future assessment at each SIGA invocation and significant handoff; **no continuous native-chat telemetry**.
- CG-O03=A: Intelligent UI progressive enhancement with complete Markdown fallback.
- CG-O04=A: signals advisory; existing gates only.
- CG-O05=A: roadmap remains under existing SKR P0 / SIGA P1 ordering pending reconciliation.
- ADR-CG-001=B historical revision was followed by conditional documentary merge authorization and publication in PR #21; **no independent skill registration/runtime or constitutional ratification**.
- ADR-CG-002=A: documentary design approval only; not constitutional ratification or implementation authorization.

Canonical design-document home: `.github/skills/siga/context-guardian.md` (M03=A). Namespaced `context_guardian` fields identify SIGA-owned proposal data, not a second component authority.
