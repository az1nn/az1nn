CAVEMAN HANDOFF v1

APP:
Az1nn GitHub profile / interactive Three.js profile

WORKSTREAM:
Profile V0.5 — Remote Twin Gateway

STATE:
Phase A contract implementation is merged to main. Gateway remains disabled by default and no provider/hosting decision has been made.

MODE:
WATCH

CANONICAL SOURCE:
- .github/skills/siga/SKILL.md
- docs/specs/profile-v0.5-remote-twin-gateway.md
- GitHub PR #15

CURRENT VERSION / HEAD:
- released profile: 0.4.0
- Phase A feature merge: b0c5ccac5e1c372574922bde8e9acbce213d09f1
- main also contains the post-merge documentation status update; resolve exact current HEAD from GitHub before acting

BASE:
main

BRANCH / ENV:
main / GitHub Pages production

PR / MR / TASK:
- PR #14 merged — preview runtime bundle fix
- PR #15 merged — V0.5 Phase A gateway contract

SPEC / ADR:
docs/specs/profile-v0.5-remote-twin-gateway.md
Status: ACCEPTED — PHASE A MERGED
No provider/hosting ADR exists or is authorized.

DONE:
- merged V0.5 provider-agnostic specification;
- fixed preview staging so imported profile/Twin modules are published;
- implemented versioned 0.5 request contract and explicit request schema validation;
- implemented response schema validation and action allowlisting;
- normalized remote actions into the existing read-only client action model;
- implemented deterministic local fallback for disabled, network, HTTP, JSON and schema failures;
- gateway remains disabled and endpoint remains null;
- added validate-gateway.mjs;
- existing validate-profile and validate-twin remained green;
- latest PR #15 HEAD 30ff7bc62505cb5c052c150c32b79756e811e41a passed Build profile preview;
- preview deployment published candidate 30ff7bc62505 for PR #15;
- PR #15 merged as b0c5ccac5e1c372574922bde8e9acbce213d09f1;
- PROFILE_VERSION remains 0.4.0.

VERIFY:
- before advancing, verify current main HEAD and production Pages deployment state;
- verify main still contains twin.gateway.mjs and gateway.enabled=false / endpoint=null;
- verify PROFILE_VERSION remains 0.4.0 unless a dedicated release workstream has started;
- do not infer a successful production Pages deploy solely from the successful PR preview.

GATES:
Unresolved human decisions before Phase B:
- gateway hosting/runtime;
- model provider/model class;
- budget/rate policy;
- telemetry retention;
- production remote-mode enablement.

BLOCKERS:
No Phase A implementation blocker remains. Production Pages result after the merge must be re-read when a reliable Actions/deployment signal is available.

INVARIANTS:
- REAL STATE > HANDOFF > MEMORY > CHAT;
- static profile remains fully usable without a gateway;
- gateway disabled by default;
- endpoint null until an explicit hosting decision;
- no browser-side provider credentials;
- public/profile-safe request context only;
- unknown request fields rejected by contract validation;
- remote output treated as untrusted;
- actions restricted to focus-project, open-repo and show-view;
- invalid remote output fails closed to local Twin;
- no provider-specific work before the human decision gates;
- PROFILE_VERSION changes only in a dedicated release PR after feature validation.

NEXT:
1. VERIFY-FIRST current main + Pages deployment.
2. If production is healthy, classify Phase A complete.
3. Do not start Phase B until the required hosting/provider/budget/telemetry decisions are explicitly made.
4. A dedicated profile release/version bump remains separate from Phase A.

VERIFY-FIRST:
Read main HEAD, PR #15 merged state, Pages/deployment status if available, PROFILE_VERSION, profile.config.js gateway config and this handoff. Real GitHub state overrides this file.
