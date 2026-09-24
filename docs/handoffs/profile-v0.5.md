CAVEMAN HANDOFF v1

APP:
Az1nn GitHub profile / interactive Three.js profile

WORKSTREAM:
Profile V0.5 — Remote Twin Gateway / Phase A contract

STATE:
V0.5 specification is merged. Preview runtime packaging hotfix PR #14 is merged. Phase A implementation is open as PR #15.

MODE:
WATCH

CANONICAL SOURCE:
- .github/skills/siga/SKILL.md
- docs/specs/profile-v0.5-remote-twin-gateway.md
- GitHub PR #15

CURRENT VERSION / HEAD:
- released profile: 0.4.0
- main baseline for Phase A: a1748f377459ee8d62c45d0e2e00e94cee2a81d5
- resolve PR #15 latest HEAD from GitHub before acting

BASE:
main

BRANCH / ENV:
feat/profile-v0.5-phase-a-contract

PR / MR / TASK:
PR #15 — feat: profile v0.5 Phase A gateway contract

SPEC / ADR:
docs/specs/profile-v0.5-remote-twin-gateway.md
Status: ACCEPTED — PHASE A IN PROGRESS
No provider/hosting ADR exists or is authorized yet.

DONE:
- reconciled PR #13 as merged and its preview build as successful;
- verified main matched PR #13 merge commit before advancing;
- found preview deployment staging omitted imported Twin runtime files;
- merged PR #14 to make preview staging copy the complete runtime and optional future gateway module;
- added twin.gateway.mjs with versioned request construction, response validation and action allowlisting;
- added deterministic local fallback for disabled/network/HTTP/JSON/schema failure paths;
- kept gateway disabled with endpoint null;
- added scripts/validate-gateway.mjs;
- wired gateway validation into preview and Pages builds;
- included gateway module in future release packaging;
- kept PROFILE_VERSION at 0.4.0.

VERIFY:
- read PR #15 latest HEAD, mergeability and changed files;
- consume Build profile preview for the latest HEAD;
- all three validators must pass: validate-profile, validate-twin, validate-gateway;
- verify preview deployment produced a candidate for PR #15 using the fixed staging workflow;
- confirm malformed/unsupported remote actions cannot escape validation;
- confirm gateway-disabled mode performs no network request and uses local grounding.

GATES:
Still unresolved and must not be selected in Phase A:
- gateway hosting/runtime;
- model provider/model class;
- budget/rate policy;
- telemetry retention;
- production remote-mode enablement.

BLOCKERS:
No product blocker known. CI/preview state for PR #15 must be read from GitHub.

INVARIANTS:
- REAL STATE > HANDOFF > MEMORY > CHAT;
- static GitHub Pages remains functional without the gateway;
- gateway disabled by default in Phase A;
- endpoint remains null in Phase A;
- no browser-side model credentials;
- public/profile-safe context only;
- remote actions are validated and restricted to focus-project, open-repo and show-view;
- invalid remote output fails closed to the local V0.4 Twin;
- PROFILE_VERSION changes only in a dedicated release PR after feature validation.

NEXT:
1. Verify PR #15 latest HEAD and workflow runs.
2. Fix any validation/build failure on the same branch.
3. Verify preview deployment after the build succeeds.
4. If automated checks pass, stop at any explicit human smoke/decision gate before provider-specific Phase B work.
5. Do not choose hosting/provider or enable production remote mode in this workstream.

VERIFY-FIRST:
Read PR #15 metadata, latest head SHA, workflow runs/jobs and preview result. Do not trust this handoff if GitHub differs.
