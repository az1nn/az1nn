# SIGA compatibility / constitutional audit — M04=A

Date: 2026-10-29
Scope: **documentary audit of draft PR #18**, against canonical SIGA on `az1nn/az1nn@main`, PR #19 SKR/G1 and approved Context Guardian ADRs (PR #21).
Status: **AUDIT COMPLETED / MERGE NO-GO / CONSTITUTION NOT RATIFIED**.
Evidence: `skills/godot/CONSTITUTION.md`, `skills/godot/orchestrator/SKILL.md`, `skills/godot/README.md` in PR #18; `.github/skills/siga/SKILL.md` in main; PR #19 approved `SIGA-G1=D`; PR #21 ADR-CG-001/002 publication.

## Findings

| ID | Severity | Evidence | Disposition |
|---|---|---|---|
| M04-C01 | **BLOCKER / contract mismatch** | Portable README and ORCHESTRATOR enumerate `RESUME/WATCH/ADVANCE/BLOCKED/HUMAN_GATE` as five *classification* modes; canonical SIGA recognizes exactly `RESUME/WATCH/ADVANCE`. | **HUMAN_GATE** to decide whether `BLOCKED` and `HUMAN_GATE` are diagnostics/dispositions rather than modes. No automatic change to the draft skill contract. |
| M04-C02 | DOCUMENTATION STALE | PR #18 description says singleton vs multi-instance question unresolved, but the draft constitution §23 explicitly defines **one authority/protocol, many execution instances, one canonical state/claim registry**. | Synchronize PR description and clarify that this is a **draft proposal**, not constitutional ratification. |
| M04-C03 | COMPATIBLE IN INTENT | Inspector retains evidence-validation authority, Reporter has no decision power, domain owners own truth, SIGA owns process; matches canonical verify-first precedence. | No authority changes suggested. E2E validation remains NOT_RUN. |
| M04-C04 | **HUMAN_GATE** | Draft constitution §25 reserves topology/authority/acceptance/gates/cross-skill contract changes for explicit human approval. | Keep Constitution WORKING DRAFT and PR #18 **DRAFT**, with **no merge** until specific constitutional review/approval. |
| M04-C05 | DEPENDENCY / no conflict | PR #19's explicit G1=D decides ambiguous SIGA scope; does not authorize the Godot tree to create additional SIGA classification modes. | Preserve exact 3 modes and the G1 decision; do not merge PR #19 on static CI alone. |
| M04-C06 | COMPATIBLE IN INTENT | Context Guardian ADR-CG-001 in main says Guardian is SIGA-internal, not a separate callable skill or orchestrator. | No extra Guardian node/skill in portable tree, Observatory PoC remains independent. |

## M04-C01 — Decision and contract correction (2026-10-30)

- **Human choice:** option **A APPROVED** in chat: exactly three SIGA core modes `RESUME`, `WATCH`, `ADVANCE`; `BLOCKED` and `HUMAN_GATE` are auxiliary dispositions, **not new modes**.
- **Authority scope:** this ratifies only the *specific classification alignment* and authorizes edits to the PR #18 draft README, ORCHESTRATOR and Constitution §24. It does **not** ratify the Godot constitution as a whole, multi-instance orchestration, topology, other authority changes, or merge permissions.
- **Contract fix:** README and ORCHESTRATOR now use three-mode classification. Constitution §24 spells out the boundary while preserving the human/domain gates.
- **State:** M04-C01 is **RESOLVED FOR DOCUMENTARY CONTRACT**. Other gates remain: §25 constitutional review where applicable, exact-head contract/behavioral tests and explicit merge review. The original finding above is retained as historical evidence.

## Merge gate: NO-GO

A GitHub `mergeable=true` value confirms technical absence of a Git merge conflict only. It is **not** evidence that these constitutional or cross-skill-contract conflicts are resolved.

Before any merge of PR #18:
1. **M04-C01 RESOLVED** by user approval of option A; verify the updated README, ORCHESTRATOR, constitution and tests at exact PR HEAD.
2. Obtain explicit human ratification for any change to authority/topology/blocking and critical cross-skill contracts under §25. **M04=A authorizes audit and documentation alignment only**, not such ratification.
3. Reconcile against the latest main SHA after PR #20 documentary merge; verify changed paths, domain-owner expectations and exact-head checks.
4. Validate a portable no-chat continuation test, concurrent ownership/claim test, and reject/insufficient-evidence/human-gate tests. Mark **NOT_RUN** until executed.

## Invariants and non-goals
- One canonical SIGA authority; potentially many execution instances under shared project truth.
- No invented context-window occupancy, no separate Guardian skill, no Observatory runtime dependency.
- No merging, M1 implementation, silent constitutional ratification, or autonomous topology alteration in this audit.
- Preserve draft constitutional text and decision provenance; do not convert documented proposals into approval.

## SIGA — Merge authorization checkpoint (2026-11-03)

**Historical status clarification:** the earlier `MERGE NO-GO` finding and §25 human gate are preserved above as *historical* reviews of a prior draft. The user has now **explicitly authorized the merge of PR #18**. This authorizes **repository incorporation of the working-draft portable skill tree only**, not a blanket constitutional ratification, activation/registration of a new orchestrator, or permission for skills to bypass human/domain gates.

At the authorization boundary:
- PR #18 was reconciled against `main@50cac374ccf03bd503468019bdd675ae7eede364`, preserving existing SKR and Context Guardian files. The effective PR diff contains only 13 Godot portable-tree/CI files, without changing the canonical `.github/skills/siga/SKILL.md`.
- The user-approved M04-C01 option A remains: **exactly three SIGA continuation modes** `RESUME`, `WATCH`, `ADVANCE`; `BLOCKED`/`HUMAN_GATE` are advisory/blocked dispositions, not new modes.
- The Godot constitution remains **WORKING DRAFT**, not fully ratified. Any future changes to operating authority/topology/human-gate rules require separate explicit approval. A published draft must not be treated as a runtime-authorized protocol.
- The six static mode/authority invariants are covered by `skills/godot/tests/validate-siga-modes.mjs`. A successful GitHub Actions check is **not** proof of end-to-end domain behavior, concurrency/claim isolation, state continuity or human review.
- There is no proven behavioral E2E for a clean-room no-chat continuation, concurrent claims or REJECT/INSUFFICIENT_EVIDENCE gates. These remain `NOT_RUN` and require future verification.
- GitHub Issues are disabled in `az1nn/az1nn` as last confirmed on 2026-11-02. Follow-up defects must be recorded in the PR discussion until Issues is enabled; no issue number should be invented.

**Disposition:** subject to GitHub exact-head success and zero merge conflicts, user authorizes merge of this draft as documentary/portable skill source. This is **not** a §25 ratification of the whole constitution or activation of a replacement SIGA. Observatory remains PoC; Context Guardian M1 is excluded.
