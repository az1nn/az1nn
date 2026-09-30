# Skill catalog

Direct operational map for the Az1nn repositories.

## Canonical in `az1nn/az1nn`

| Skill | Trigger | What it owns | Use when | Do not use for |
|---|---|---|---|---|
| **SIGA** | `Siga` | Verify-first continuation, repository state, RESUME/WATCH/ADVANCE, validation and durable handoff. | You want the project to discover where it really is and continue correctly. | A narrow specialist task when you already know the domain command and do not need top-level continuation. |
| **GODOT** | `Godot [command]` | Godot architecture, GDScript, scenes, Resources, renderer, debug, tests, profiling, export and engine learning. | The task is specifically about a Godot project/engine concern. | Narrative canon, art-direction approval or generic repo continuation. |

Canonical paths:

```text
.github/skills/siga/SKILL.md
.github/skills/godot/SKILL.md
```

## Project-local specialists in `az1nn/growing-rio`

These remain local because they encode DA LATA authority, state and workflow. The main repository may reference them, but should not copy their project identity/state blindly.

| Skill | Trigger | What it does | Use when |
|---|---|---|---|
| **SIGA concurrency** | helper loaded by SIGA | Safe branch/PR/file mutation under concurrent sessions; exact-head CI, drift classification and merge guards. | More than one actor/session/PR may move repository state during a mutating wave. |
| **LORE** | `Lore` | Narrative canon, chronology, characters, factions, campaign meaning; preserves CÂNONE/RUMOR/ABERTO. | The question is what is true, unknown or intentionally unresolved in the fictional world. |
| **CENA** | `CENA` / `Cena` | Visual research, art-direction contract, asset/provenance decisions, scene composition and rendered acceptance. | You need to decide what a scene should look/read like or whether a rendered candidate passes. |
| **ARTIST** | `ARTIST` | V1 style studio: isolated scene/object concepts, prompt generation, versioned human review and acceptance ledger. | Before or during production art when the visual target itself needs to be generated/reviewed. |
| **LENTE** | `LENTE` | Exact-head screenshots/videos, isolated scene evidence, CAVEMAN visual analysis and before/after QA. | You need evidence of what the game actually renders and what to improve. |
| **3JS** | `3js` | Three.js scene implementation/parity/performance under SIGA+CENA+LORE. | Only when an active task explicitly owns Three.js work. |

Current renderer note for DA LATA:

```text
New V1 production direction = GODOT_NATIVE_V1.
```

The existing `3JS` skill remains useful for maintained/historical Three.js scopes, but it is not the default renderer route for new V1 scene production.

## Routing cheat sheet

```text
"continue the project"             -> SIGA
"Godot is failing / how build X?"  -> GODOT
"what is canon / write narrative"  -> LORE
"what should this scene look like" -> CENA
"generate/review the art target"   -> ARTIST
"show me what really renders"      -> LENTE
"implement this in Three.js"       -> 3JS
"multiple sessions may collide"    -> SIGA concurrency
```

## Skill composition

Typical Godot visual delivery:

```text
SIGA
-> CENA / ARTIST when visual target is unresolved
-> GODOT for engine implementation
-> LENTE for exact rendered evidence
-> CENA for visual ACCEPT/REVISE when required
-> SIGA for gates/merge/handoff
```

Typical non-visual Godot delivery:

```text
SIGA
-> GODOT
-> repository tests / exact-head CI
-> SIGA merge/handoff
```

## Storage rule

- portable skill definition: main repository when genuinely cross-project;
- project-specific authority/state: project repository;
- transient chat/model memory: never the canonical source of operational state.
