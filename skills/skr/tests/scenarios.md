# SKR behavioral scenario matrix

These are MANUAL acceptance exercises for a live agent using the named skill and target project. Their existence is not evidence that an LLM executed them. Automated contract checks merely confirm coverage and routing text.

| ID | Input/state | Expected behavior | Gate / verification |
|---|---|---|---|
| S01 | SKR SIGA, skill exists | read canonical SIGA + adjacent tree, report trigger/authority/state/tests/handoff | trace target path+HEAD |
| S02 | SKR GHOST, no such skill | BLOCKED_DISCOVERY; no invented skill | missing-file evidence |
| S03 | choose A + C + Outro: shorter retries | preserve A,C and exact free text; combine compatible rules | ledger fields distinct |
| S04 | Outro: custom solution (no choices) | valid non-empty decision, not invalidated | ledger preserves text |
| S05 | constitutional authority change proposed | HUMAN_GATE, never self-approve | diff + human authority |
| S06 | previous visual REJECT with new mockup | retain REJECT provenance; no implicit ACCEPT | version-tagged evidence |
| S07 | target repo has no roadmap | ROADMAP_MISSING; don't create competing one silently | real path check |
| S08 | target repo has no Spec Kit CLI | SPEC_KIT_SETUP_REQUIRED and draft artifacts; do not claim CLI run | command existence check |
| S09 | overlapping active claim | reconcile under SIGA before mutation | claim/head check |
| S10 | only a static drawing exists for a runtime requirement | INSUFFICIENT_EVIDENCE, not PASS | runtime capture missing |
| S11 | valid repo+Spec Kit+roadmap, all gates cleared | spec+plan+tasks+ledger+roadmap, checks, report, handoff | exact HEAD E2E result |
| S12 | prior G1..G10 fully decided | resume first unresolved question, don't repeat previous | decision ledger |
| S13 | deterministic decisions sufficiently evidenced | batch AUTO_RESOLVED, report rationale without serial approvals | no unauthorized gate |
| S14 | human answer contains contradictory Outro vs choice | record DECISION_CONFLICT and ask only if ambiguity is material | no silent override |
| S15 | interactive host | render non-exclusive choices and visible multiline Outro textarea in same question | UI acceptance, exact payload |
| S16 | text-only host | accept Outro-only and A+C+Outro in text without claiming UI widgets | ledger/manual fallback |

Recommended E2E smoke sequence:

1. Checkout the exact target ref and invoke SKR ART (or another installed skill).
2. Confirm direct/parent/sibling skill contracts and constitutional boundary were loaded.
3. Supply A + C + Outro: ... on a non-constitutional question; review ledger for lossless encoding.
4. Supply an explicitly constitutional change; verify SKR stops at the correct human gate.
5. Confirm spec -> plan -> tasks -> decision ID -> existing roadmap linkage and priority integrity.
6. Execute available target tests and read exact HEAD CI; capture visual evidence if relevant.
7. Re-run SKR ART and verify resume without duplicated G decisions.
8. Persist actual outcome, including NOT_RUN where the environment lacks runtime validation.
