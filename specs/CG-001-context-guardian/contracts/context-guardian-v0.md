# Context Guardian — proposed contracts v0 (non-executable)

All field names and examples are **proposal**, not deployed schema. Future implementation must validate contracts with automated fixtures.

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
Do not replace the canonical CAVEMAN HANDOFF v1. Add a separate section or a namespaced `context_guardian` object to an envelope if supported.

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
