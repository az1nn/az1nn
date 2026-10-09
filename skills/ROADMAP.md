# Portable Skills Roadmap

Created 2026-10-09 after verifying that main did not contain a skills roadmap. This is the Az1nn/az1nn *skills* roadmap; it does not supersede project roadmaps, nor override work in an open PR.

| Priority | Feature | Spec | State | Dependencies / gate |
|---|---|---|---|---|
| P0 | SKR standardized skill grilling and Spec Kit delivery | [001-skr-grilling](../specs/001-skr-grilling/spec.md) | PROPOSED in feat/001-skr-standardized-grilling; not merged | static/CI, live E2E exercise, review |
| Existing separate work (not reprioritized) | Godot portable skill tree | [PR #18](https://github.com/az1nn/az1nn/pull/18) | OPEN DRAFT in separate branch | constitutional gates and scope owned by that PR |

Rules for SKR-generated project changes:

1. Always discover the target repository's EXISTING roadmap and current priorities first.
2. Append/update by feature ID and dependency order; respect active work, locks and owner authority.
3. Never silently create a second roadmap for a target project, reorder unrelated items or unlock approved scope.
4. If none exists, record ROADMAP_MISSING and surface a precise gate; complete working spec/plan/tasks first.
5. Spec/roadmap state is NOT proof of implementation. Require versioned verification and applicable human approval before COMPLETE.
