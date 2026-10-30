# SPEC-CG-001 — Acceptance and verification plan

Status: **NOT RUN / IMPLEMENTATION NOT AUTHORIZED**. Documentary review is not runtime test success.

| Test | Scenario | Required future result |
|---|---|---|
| CG-T01 | Short text input | Exact measured sample chars, heuristic token range clearly marked, actual window unavailable |
| CG-T02 | Huge pasted conversation | Advisory sample-length flag only; no claimed 80%/95% context usage |
| CG-T03 | Partial / absent chat history | `PARTIAL` or `UNKNOWN` coverage; no assumption of invisible messages |
| CG-T04 | Decision A approved; newer assistant text contradicts it | Detect conflict without silently modifying authoritative decision |
| CG-T05 | Explicit human-approved supersession | Keep old decision/rejection evidence; append versioned supersession |
| CG-T06 | Handoff saved with stale commit SHA | Flag drift and require real-state RECONCILE before actions |
| CG-T07 | Missing handoff evidence | `INSUFFICIENT_EVIDENCE` / `UNKNOWN`, not fabricated FAIL or PASS |
| CG-T08 | Resume in new ChatGPT chat with only handoff | Reconstruct from source links and explicit verification; not hidden chat |
| CG-T09 | Two concurrent SIGA executions | Reconcile logical ownership and source versions before mutation |
| CG-T10 | Confidential chat passage supplied | Do not publish verbatim to public repository; sanitized metadata only |
| CG-T11 | Observatory unavailable | Guardian design continues independently |
| CG-T12 | Proposal for new hard blocking gate | Flag constitutional HUMAN_GATE; no silent activation |
| CG-T13 | Proposed integration with draft PR #18/#19 | No changes to those PRs or roadmap reordering |
| CG-T14 | Markdown-only host | All signal/handoff details remain accessible without Intelligent UI |
| CG-T15 | Scope excludes API/daemon | No fabricated live monitoring, autonomous capture or provider telemetry |
| CG-T16 | Unified SIGA design | No separately invocable Context Guardian skill/agent/authority; diagnostics are SIGA-internal only |
| CG-T17 | CG-007 decision integrity | O01–O05 marked approved for documentation; ADR-CG-002 approved documentarily; ADR-CG-001 revised but pending reapproval |
| CG-T18 | Existing gate preservation | No new blocking authority or constitutional approval implied by CG-O04=A or revised ADR-CG-001 |

## M0 documentary gate
- [x] Existing canonical SIGA and PR #18/#19 reviewed from remote sources
- [x] Scope and Observatory isolation stated
- [x] Proposed schemas, governance and evidence taxonomy documented
- [ ] Spec Kit CLI execution (not run)
- [ ] Contract validator and tests (not implemented)
- [x] GitHub check/status availability previously inspected in CG-006; Vercel SUCCESS at prior exact HEAD; **not** GitHub Actions/Spec Kit validation. Re-run after CG-007 documentation commits.
- [x] ADR-CG-001 and ADR-CG-002 published documentarily via PR #21; constitutional ratification, if change triggers it, separately required and NOT granted.
- [ ] Authorization for M1 (not granted)

## CG-007 documentary decision review
- [x] CG-O01=A, CG-O02=A, CG-O03=A, CG-O04=A, CG-O05=A captured as approved **design choices**.
- [x] ADR-CG-002=A captured as approved **documentary** decision.
- [x] ADR-CG-001=B revised to propose one integrated SIGA capability; no separately invocable skill.
- [x] Subsequent conditional authorization to **publish documentary ADR-CG-001** and publication via PR #21; not constitutional ratification.
- [x] CG-007 documentary disposition recorded. **M1 remains NOT AUTHORIZED.**

## Definition of done
M0 means documents are present and can be independently read in a separate draft PR. M0 does not mean the Guardian exists as an active skill or that later milestones passed.

## CG-008 M02/M03 documentary merge gates
- [ ] Effective diff contains only the eight remaining documentary files (two ADRs already in main).
- [ ] SIGA-internal documentation under `.github/skills/siga/context-guardian.md`; no executable Guardian skill or canonical `SKILL.md` edit.
- [ ] Exact-head CI/checks inspected, NOT_RUN distinguished from PASS.
- [ ] No new gate, M1 implementation, constitutional ratification or Observatory dependency.
- [ ] Merge only with rechecked expected HEAD and repository gates; no PR #18/#19 merge.
