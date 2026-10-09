# Portable Skills Roadmap

Created 2026-10-09 after verifying that main did not contain a skills roadmap. This is the Az1nn/az1nn *skills* roadmap; it does not supersede project roadmaps, nor override work in an open PR.

| Priority | Feature | Spec | State | Dependencies / gate |
|---|---|---|---|---|
| P0 | SKR standardized skill grilling and Spec Kit delivery | [001-skr-grilling](../specs/001-skr-grilling/spec.md) | DRAFT PR #19; CI 22/22 PASS at 9ddd24b; live S01 discovery PASS, full E2E PARTIAL | Complete manual/hybrid/negative checks, real Spec Kit CLI assessment, review and approval |
| P1 after SKR P0 | SIGA flow verification / multi-workstream targeting | [002-siga-verification](../specs/002-siga-verification/spec.md) | PROPOSED; G1 D APPROVED, implementation and behavioral tests pending | Finish SKR P0, scope arbitration implementation, suite and exact-head tests; no canonical SIGA change yet |
| Existing separate work (not reprioritized) | Godot portable skill tree | [PR #18](https://github.com/az1nn/az1nn/pull/18) | OPEN DRAFT in separate branch | constitutional gates and scope owned by that PR |

Rules for SKR-generated project changes:

1. Always discover the target repository's EXISTING roadmap and current priorities first.
2. Append/update by feature ID and dependency order; respect active work, locks and owner authority.
3. Never silently create a second roadmap for a target project, reorder unrelated items or unlock approved scope.
4. If none exists, record ROADMAP_MISSING and surface a precise gate; complete working spec/plan/tasks first.
5. Spec/roadmap state is NOT proof of implementation. Require versioned verification and applicable human approval before COMPLETE.
