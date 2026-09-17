# Profile V0.4 — Conversational Twin

## Goal

Turn the V0.3 command console into a conversational product surface without pretending that the static GitHub Pages client is a privileged AI runtime.

V0.4 remains **local-first, graph-grounded and read-only**.

## Runtime decomposition

```text
profile.config.js
        │
        ├── Three.js graph runtime (app.js)
        │
        └── Twin conversation runtime
            ├── twin.model.mjs
            │   └── pure intent + grounded response model
            └── twin.conversation.js
                ├── UI adapter
                ├── public GitHub activity context
                └── allowlisted profile actions
```

The conversation model receives only:

- the public `PROFILE` graph;
- normalized recent public GitHub events;
- the current user query.

It does not receive private repositories, tokens, browser secrets or arbitrary tools.

## Grounding model

Supported conversational domains:

- projects and project metadata;
- explicit project relationships;
- public GitHub activity / commit signals;
- the configured engineering timeline;
- AI Twin identity and capabilities;
- navigation into existing project focus and system views.

Unsupported questions fail closed with a bounded fallback instead of fabricating an answer.

Every Twin response can include `evidence[]` labels so the UI can expose what part of the public graph grounded the answer.

## Action contract

V0.4 allows only three action families:

```text
focus-project(projectId)
open-repo(projectId)
show-view(activity | relations | timeline)
```

`focus-project` and `show-view` reuse already-existing V0.3 profile interactions. `open-repo` can only open the URL configured for a public project.

No mutation action exists.

## Activity context

The conversation adapter reads the same public GitHub Events API boundary used by V0.3.

To reduce duplicate network pressure, V0.4 keeps a short-lived `sessionStorage` cache. Cache failure is non-fatal and activity failure degrades to the static graph.

Activity is used only as presentation / grounding context. It never grants authority.

## Gateway boundary

The public configuration intentionally contains:

```js
conversation: {
  mode: "local-grounded",
  gateway: null,
}
```

This is an invariant for V0.4.

A future remote conversational model must change the architecture explicitly:

```text
GitHub Pages
    │
    │ constrained HTTPS request
    ▼
Twin Gateway
├── server-side model credentials
├── request schema validation
├── origin / abuse controls
├── rate limiting
├── output policy
├── explicit tool allowlist
└── observability
    │
    ▼
approved public/read-only context by default
```

The browser must never receive model provider credentials or privileged GitHub credentials.

## Validation

`Build profile preview` now gates:

- syntax for the Three.js runtime, conversation adapter and pure model;
- profile graph semantic invariants;
- V0.4 conversation configuration invariants;
- deterministic conversational cases for project, relation, activity, focus and repository-open intents;
- fail-closed behavior for an ungrounded question;
- the allowlisted action surface;
- presence of every runtime file in the preview artifact.

Production Pages runs the same semantic and conversation validations before staging the site.

## Promotion

```text
V0.3 PR (#8)
    ↓ stacked
V0.4 conversational Twin PR
    ↓
preview deploy
    ↓
human smoke
    ↓
V0.3 merge / retarget
    ↓
V0.4 merge
    ↓
dedicated profile-v0.4.0 release PR
```

The feature branch does not bump `PROFILE_VERSION`.
