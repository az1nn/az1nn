# Az1nn Profile Architecture

## Purpose

The profile is treated as a small versioned product rather than a decorative README. It has two public surfaces:

1. GitHub profile README — fast, static overview.
2. GitHub Pages experience — interactive Three.js engineering graph.

`profile.config.js` is the runtime source of truth for profile entities and relationships.

## Runtime model

```text
PROFILE
├── owner
├── twin
│   └── states
├── projects[]
├── relations[]
├── timeline[]
└── activity
```

The Three.js scene consumes that model and derives:

```text
AZ1NN core
├── project nodes
├── AI Twin node
├── project relations / signal particles
└── public activity orbit
```

The DOM panel is a projection of the same state. It provides System Map, Project Focus, Activity, Graph, Timeline and AI Twin Console views.

## AI Twin trust boundary

V0.3 deliberately keeps the AI Twin Console local.

```text
Browser
├── local command parser
├── profile graph
├── Three.js scene state
└── public GitHub activity API

NO API KEY
NO REMOTE LLM
NO PRIVILEGED GITHUB TOKEN
```

The console can inspect and manipulate only data already exposed by the public profile. It cannot execute arbitrary JavaScript, mutate GitHub, read private repositories or access secrets.

A future conversational Twin must preserve that boundary:

```text
GitHub Pages browser
        │
        │ HTTPS / constrained request
        ▼
server-side Twin gateway
├── secret-managed model credentials
├── input/output policy
├── explicit tool allowlist
├── rate limiting
└── observability
        │
        ▼
approved read-only/public context by default
```

Model credentials must never be embedded in the static Pages bundle or `profile.config.js`.

## Public activity layer

V0.3 reads `https://api.github.com/users/az1nn/events/public` directly from the browser. This source is intentionally best-effort:

- it contains public GitHub events only;
- rate limiting or network failures must not break the profile;
- the runtime falls back to `OFFLINE` while the static graph remains usable;
- activity is presentation data, not a source of authorization or profile configuration.

## Delivery model

```text
feature branch
    ↓
PR preview build
    ↓
semantic + syntax gates
    ↓
main-branch Pages preview deploy
    ↓
human smoke
    ↓
merge
    ↓
dedicated PROFILE_VERSION bump
    ↓
profile-vX.Y.Z release
```

The release bundle contains the public profile surface only. Development documentation, validation scripts and workflow implementation remain outside the profile release artifact.

## Invariants

- Project IDs are unique.
- Relation endpoints must resolve to existing project IDs.
- The Twin ID cannot collide with a project ID.
- Relations cannot point to themselves.
- Relation strength is normalized to `0..1`.
- The required Twin states are `idle`, `thinking` and `building`.
- Activity source must remain HTTPS and on `api.github.com` unless the trust model is explicitly revised.
- The static experience must continue working when live activity is unavailable.
- Any future remote AI integration must keep credentials server-side.
