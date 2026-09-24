CAVEMAN HANDOFF v1

APP:
Az1nn GitHub profile / interactive Three.js profile

WORKSTREAM:
Profile V0.5 — Remote Twin Gateway specification

STATE:
V0.4 release verified complete. V0.5 specification opened as PR #13.

MODE:
ADVANCE -> WATCH after PR creation

CANONICAL SOURCE:
- .github/skills/siga/SKILL.md
- docs/specs/profile-v0.5-remote-twin-gateway.md
- GitHub PR #13

CURRENT VERSION / HEAD:
- released profile: 0.4.0
- main baseline before V0.5 spec: 6108115376d294845c0ac3f292822c425bffee5d
- V0.5 spec branch: spec/profile-v0.5-remote-twin-gateway

BASE:
main

BRANCH / ENV:
spec/profile-v0.5-remote-twin-gateway

PR / MR / TASK:
PR #13 — docs: specify profile v0.5 remote Twin gateway

SPEC / ADR:
docs/specs/profile-v0.5-remote-twin-gateway.md
No ADR yet. Provider/hosting selection is intentionally not decided.

DONE:
- reconciled repository-local SIGA protocol;
- verified profile-v0.4.0 release exists with ZIP + SHA-256 asset;
- verified latest explicit Pages retry on main completed successfully;
- verified no V0.5 branch, PR, issue or persisted roadmap existed;
- created provider-agnostic V0.5 Remote Twin Gateway spec;
- opened PR #13.

VERIFY:
- PR #13 must remain docs/spec only;
- inspect PR workflow runs/checks after latest handoff commit;
- merge only when repository checks are green and no merge conflict exists;
- after merge, re-run VERIFY-FIRST before creating Phase A implementation.

GATES:
Implementation may not silently select:
- gateway hosting/runtime;
- model provider/model class;
- budget/rate policy;
- telemetry retention;
- production remote-mode enablement.

These gates do not block merging the provider-agnostic specification itself.

BLOCKERS:
None known at handoff write time. CI state must be re-read from GitHub.

INVARIANTS:
- REAL STATE > HANDOFF > MEMORY > CHAT;
- static GitHub Pages remains functional without the gateway;
- no browser-side model credentials;
- public/profile-safe context only by default;
- remote actions remain allowlisted and validated;
- fail closed and fall back locally;
- no arbitrary tools, repository mutation or private-repo access in V0.5 without a new spec;
- PROFILE_VERSION changes only in a dedicated release PR after feature validation.

NEXT:
1. Verify PR #13 checks against its latest HEAD.
2. If green and mergeable, merge PR #13.
3. Reconcile main after merge.
4. Start Phase A only: provider-agnostic request/response contract, schema validation and fallback plumbing.
5. Stop before provider-specific deployment choices unless the human decision gates have been explicitly resolved.

VERIFY-FIRST:
Read PR #13 metadata + latest head SHA + workflow runs/checks; verify main/release state; do not assume this handoff is current.
