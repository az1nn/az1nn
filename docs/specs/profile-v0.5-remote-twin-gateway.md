# Profile V0.5 — Remote Twin Gateway Specification

Status: **ACCEPTED — PHASE A MERGED**
Workstream: **Az1nn interactive profile / AI Twin**
Baseline: `main@6108115376d294845c0ac3f292822c425bffee5d`
Previous release: `profile-v0.4.0`

## 1. Objective

Evolve the V0.4 local, graph-grounded conversational Twin into an optional remote AI integration without weakening the profile's current trust boundary.

V0.5 must preserve the static GitHub Pages experience as the resilient baseline while introducing a constrained server-side gateway for model-backed answers.

## 2. Product behavior

The public profile continues to load and operate with no backend dependency.

When a gateway is configured and healthy, the conversational Twin may:

- answer natural-language questions grounded in the public profile graph;
- use recent public GitHub activity already available to the browser;
- return explicit grounding/evidence metadata;
- expose only allowlisted read-only UI actions already supported by the client;
- fall back to the deterministic local V0.4 model when the remote path is unavailable, rate-limited or rejected.

The remote path must never be required for basic profile navigation, Project Focus, Graph, Activity, Timeline or the local Twin console.

## 3. Non-goals

V0.5 does **not** authorize:

- arbitrary tool execution;
- mutation of GitHub repositories, issues, PRs or user data;
- access to private repositories;
- browser-embedded model/API credentials;
- storage of conversation history by default;
- background agents;
- unrestricted web browsing;
- shell/code execution;
- autonomous deployment or repository mutation from the public profile.

Any of those capabilities require a separate spec and trust-boundary review.

## 4. Trust boundary

```text
GitHub Pages browser
  ├── profile.config.js
  ├── public GitHub activity
  ├── deterministic local Twin fallback
  └── constrained HTTPS request
            │
            ▼
Remote Twin Gateway
  ├── server-side secret management
  ├── request validation
  ├── rate limiting
  ├── origin policy
  ├── prompt/context assembly
  ├── model provider adapter
  ├── output validation
  ├── action allowlist enforcement
  └── observability
            │
            ▼
Model provider
```

Secrets remain server-side. The browser receives no provider credential and no privileged token.

## 5. Gateway contract

### Request

`POST /v1/twin/respond`

```json
{
  "version": "0.5",
  "question": "How are MyHub and CPXLABS Admin related?",
  "profile": {
    "projects": [],
    "relations": [],
    "timeline": []
  },
  "activity": [],
  "client": {
    "profileVersion": "0.4.0"
  }
}
```

Rules:

- reject unknown top-level fields unless explicitly versioned;
- cap question length;
- cap context size;
- accept only public/profile-safe context;
- never accept secrets or GitHub tokens from the browser;
- treat browser-provided context as untrusted input.

### Response

```json
{
  "answer": "…",
  "grounding": [
    {
      "kind": "project",
      "id": "myhub"
    }
  ],
  "actions": [
    {
      "type": "focus-project",
      "target": "myhub"
    }
  ],
  "mode": "remote-grounded",
  "requestId": "…"
}
```

Allowed action types remain:

- `focus-project`
- `open-repo`
- `show-view`

The browser must validate the response again before executing an action.

## 6. Failure behavior

The profile must fail closed and degrade locally.

Remote failures include:

- network timeout;
- provider timeout;
- 4xx policy rejection;
- 429 rate limit;
- 5xx gateway/provider error;
- malformed model output;
- unsupported action;
- missing grounding;
- gateway origin mismatch.

For all remote failures:

1. preserve the page and scene state;
2. do not execute remote-provided actions;
3. surface a compact status;
4. fall back to the deterministic V0.4 local Twin where possible;
5. never fabricate remote success.

## 7. Security requirements

- Secrets only in the gateway environment.
- CORS/origin policy restricted to approved profile origins.
- No wildcard mutation tools.
- No eval or arbitrary JavaScript execution.
- Request and response schema validation.
- Explicit max input/output sizes.
- Server-side rate limiting.
- Provider timeouts and cancellation.
- Structured logs with request IDs.
- Logs must exclude secrets and unnecessary prompt content.
- CSP-compatible client integration.
- Public profile data only by default.
- Model output is untrusted until validated.

## 8. Privacy requirements

Default behavior is stateless request processing.

If observability requires request capture, store only the minimum fields needed for debugging and aggregate metrics. Conversation retention, analytics identifiers or user fingerprinting require explicit follow-up specification.

## 9. Observability

Minimum gateway signals:

- request count;
- success/failure count by class;
- latency p50/p95;
- provider latency;
- fallback rate;
- rate-limit count;
- schema rejection count;
- invalid-action rejection count.

No SLO is asserted until a hosting/provider choice exists.

## 10. Client integration plan

### Phase A — contract only

- add versioned gateway configuration;
- keep gateway disabled by default;
- add request/response schema validation;
- add deterministic fallback adapter;
- add tests for rejected/malformed responses.

### Phase B — provider-backed preview

- deploy gateway to a non-production endpoint;
- configure preview only;
- validate CORS, rate limits, fallback and telemetry;
- run human smoke against representative grounded prompts.

### Phase C — production opt-in

- enable production gateway only after provider/hosting/cost decisions are approved;
- keep local fallback permanently available;
- preserve rollback by configuration.

## 11. Verification gates

Implementation PRs must prove:

- existing `scripts/validate-profile.mjs` passes;
- existing `scripts/validate-twin.mjs` passes;
- new gateway contract tests pass;
- malformed responses cannot trigger actions;
- unsupported actions are rejected;
- no secret appears in built Pages artifacts;
- static profile works with the gateway disabled;
- static profile works when the gateway endpoint is unreachable;
- preview deployment succeeds;
- human smoke validates degraded/offline and remote modes.

## 12. Human decision gates

Implementation must not select these silently:

1. **Gateway hosting/runtime**
   - edge/serverless/function/container or equivalent.

2. **Model provider**
   - provider and model class.

3. **Budget / rate policy**
   - monthly ceiling, per-IP/session limits and abuse policy.

4. **Telemetry retention**
   - metrics/log retention and whether prompt content is retained at all.

5. **Production enablement**
   - preview-only versus production remote mode.

These decisions can be made independently; the implementation should keep adapters/provider configuration replaceable.

## 13. Acceptance criteria

V0.5 is complete only when:

- the public static profile remains fully usable with the remote path disabled;
- remote answers are constrained to public/profile-safe grounding;
- remote actions are schema-validated and allowlisted on both gateway and client;
- secrets are absent from client/release artifacts;
- rate limiting and failure fallback are verified;
- preview smoke passes;
- `PROFILE_VERSION` is promoted in a dedicated release PR only after the feature PR is merged and validated.

## 14. Next implementation boundary

After this spec is accepted, create a feature branch from current `main` for **Phase A only**.

Do not choose a provider or deploy a production gateway during Phase A. The first implementation unit is the provider-agnostic client/gateway contract, validation layer and fallback behavior.
