# Godot knowledge base

Durable engineering notes for Godot 4.x work.

**Authority order:** current project > active architecture/spec > official stable Godot docs > proven project examples > memory.

The main field reference is `az1nn/growing-rio`. Patterns below are generalized only when they remain valid outside that game.

---

## 1. Start by reading the project, not by assuming Godot defaults

Always inspect:

```text
project.godot
export_presets.cfg
main scene
autoloads
renderer
repository test/CI entry points
active spec / architecture docs
```

Why: renderer, stretch mode, Autoload ownership and export constraints materially change what a correct implementation looks like.

### growing-rio evidence

The project currently demonstrates:

- Godot 4.7-series project config, with the README pinning 4.7.2 stable;
- GDScript;
- portrait-first UI;
- Godot-native rendering;
- GL Compatibility for desktop/mobile configuration;
- one canonical `GameState` Autoload;
- domain services below that boundary;
- repository-defined validation in CI.

Those are useful examples, not defaults for every Godot project.

---

## 2. Scene organization: cohesive and independently understandable

Prefer a scene that owns one coherent player-facing or reusable responsibility.

A reusable subscene should not need to know where its parent lives in the final application.

Prefer:

```text
parent/composition root
  -> configures child
  -> listens to child signals
  -> issues explicit commands
```

Avoid:

```text
deep child
  -> "../../../../../OtherSystem"
  -> assumes exact parent hierarchy
```

### Practical rule

If moving a subscene elsewhere breaks it because of hardcoded external NodePaths, its boundary is probably too coupled.

### Communication

Use:

- direct method calls for explicit commands when the owner is known;
- signals for events/notifications and decoupled upward communication;
- injected references/configuration for dependencies a reusable child needs.

Signals should describe something that happened, not become a hidden command bus for every action.

---

## 3. Autoload: broad lifetime, narrow responsibility

Autoload is useful for state or services that must outlive scene changes and have project-wide scope.

It is not a license to create a giant global manager.

Good candidates:

- canonical session/game state;
- navigation/session coordinator with true global lifetime;
- save coordinator;
- audio/global service when the scope genuinely spans scenes.

Bad pattern:

```text
Global.gd
  -> gameplay rules
  -> UI formatting
  -> save parsing
  -> economy formulas
  -> scene switching
  -> rendering helpers
  -> everything else
```

### growing-rio lesson

A strong pattern from `growing-rio` is:

```text
UI
  -> GameState command/read boundary
  -> focused domain services
  -> save-safe canonical state/resources
```

`GameState` owns orchestration/canonical runtime state, while focused services own deterministic rules.

Generalize the separation, not the class names.

---

## 4. Keep domain rules out of UI scripts

UI should not be a second implementation of the game/system rules.

Prefer:

```text
UI asks: "what can I show?"
domain returns: snapshot/view data

UI asks: "perform action X"
domain/state boundary validates and mutates
```

Benefits:

- fewer duplicated formulas;
- deterministic tests;
- renderer/UI replacement is cheaper;
- save migrations are easier to reason about;
- business/gameplay logic can run headless.

### growing-rio evidence

Its Market/Operation surfaces read through `GameState` boundaries and submit mutations through existing commands instead of reproducing pricing/action-availability logic in scene code.

That is the pattern worth keeping.

---

## 5. Nodes are for scene-tree behavior; data does not automatically need a Node

Choose the lightest Godot abstraction that matches the responsibility.

### Node

Use when you need scene-tree lifecycle, transforms, processing, input, engine callbacks or composition.

### Resource

Use for reusable/editor-friendly serialized definitions:

- item/unit definitions;
- configuration;
- content catalogs;
- materials/data assets;
- narrative definitions;
- balance/config data.

### RefCounted / plain GDScript class

Use for lightweight data/domain logic that does not need the scene tree.

### Rule of thumb

If an object exists only to calculate or hold data, ask why it needs to be a Node.

---

## 6. GDScript: optimize for readable contracts

Use the official style guide as the baseline.

Recommended defaults:

- `snake_case` for functions/variables;
- `PascalCase` for classes;
- explicit return types on meaningful functions;
- type public/domain boundaries;
- use constants/enums for stable closed sets;
- keep `_ready()`, `_process()` and input callbacks thin;
- delegate non-trivial rules to focused functions/classes;
- use `class_name` when a reusable named type improves the codebase;
- document invariants and surprising constraints.

Static typing is especially valuable at boundaries because it catches errors earlier and makes APIs self-describing.

Do not add types mechanically when they make an intentionally dynamic/data-driven API harder to use without improving safety.

---

## 7. Stable IDs beat display strings

Persist/domain identity should not depend on translated/user-facing labels.

Prefer:

```text
definition_id = "room_basic"
display_name = "Quarto Básico"
```

not:

```text
id = "Quarto Básico"
```

This is especially important for:

- save files;
- Resources;
- content catalogs;
- event IDs;
- scene/context routing;
- analytics/test fixtures.

The same pattern is used extensively in `growing-rio`.

---

## 8. Persistence: one canonical schema and explicit migrations

A save system should have:

- schema/version;
- canonical serialization boundary;
- validation before partial mutation;
- migration path from supported older versions;
- stable IDs;
- deterministic round-trip tests.

Avoid scene-owned save fragments with implicit compatibility rules.

UI should request Save/Load through the persistence/domain boundary, not mutate canonical state while parsing files.

---

## 9. Renderer choice is architecture

Do not choose a Godot renderer because it is fashionable.

Evaluate:

- target devices;
- Web requirements;
- shader/material needs;
- lighting/shadow needs;
- GPU compatibility;
- performance budget;
- visual direction;
- export constraints.

### growing-rio lesson

For its current Web/mobile target, the project locked a Godot-native GL Compatibility V1 path after evaluating the renderer decision.

That decision is correct for that product context, not a blanket recommendation for all Godot projects.

---

## 10. Separate scene rendering from UI resolution when the art direction needs it

For stylized/pixelated 3D, a useful composition boundary is:

```text
full-resolution UI
  + SubViewportContainer
      -> lower-resolution 3D SubViewport
      -> nearest upscale
```

This avoids pixelating text/navigation while preserving a deliberate low-resolution scene treatment.

`growing-rio` uses this as a V1 art-system policy.

Do not use this technique unless the visual direction asks for it.

---

## 11. Input: one semantic action, multiple accessible paths

Pointer/touch geometry and visible controls should converge on the same semantic command.

Prefer:

```text
3D hotspot click
accessible/fallback button
keyboard/controller action
    -> same command ID / same domain action
```

Do not implement separate gameplay rules per input surface.

For overlays/modals, make input ownership explicit so background navigation does not accidentally continue receiving commands.

---

## 12. Testing: match the test to the layer

A useful stack:

### Pure/domain

Test deterministic calculations without loading a scene when possible.

### Engine/headless

Use Godot headless tests for:

- scene lifecycle;
- Resource loading;
- signals;
- input contracts;
- save/load integration;
- engine-specific behavior.

### Structural validators

Use lightweight scripts for repository invariants such as:

- expected resource IDs;
- manifest coverage;
- required files;
- no forbidden dependency;
- config contracts.

### Rendered acceptance

Player-visible changes need actual rendered evidence.

A headless pass proves code can execute, not that framing, lighting, z-order or touch targets look correct.

---

## 13. CI: validate the exact code you intend to merge

A green workflow from an older SHA is stale evidence after new commits.

Prefer CI that:

1. checks out the exact PR head;
2. runs the canonical repository validation entry point;
3. produces targeted render/export artifacts when needed;
4. records the head SHA with evidence.

`growing-rio` explicitly follows this exact-head rule.

---

## 14. Export: generated output is evidence, not source architecture

Use checked-in export presets and a reproducible Godot editor/template version.

Prefer:

```bash
godot --headless --path . --export-release "<preset>" <output>
```

Validate the produced artifact.

Avoid hand-editing generated Web export JS/PCK/WASM as the long-term source of application behavior. Fix the source project/export pipeline instead.

---

## 15. Performance: profile before optimizing

First classify the symptom:

- consistently low FPS;
- intermittent stall;
- slow loading;
- memory pressure;
- GPU bottleneck;
- CPU/script bottleneck.

Then measure.

Useful dimensions:

- frame time / FPS;
- CPU profiler;
- GPU profiler;
- draw calls;
- triangle/geometry counts;
- material/shader count;
- textures and memory;
- dynamic lights/shadows;
- active processing;
- repeated allocations.

Optimization without before/after evidence is speculation.

### Practical 3D budget habits

- reuse materials/geometries when semantics allow;
- instance repeated geometry when it materially helps;
- constrain texture sizes;
- avoid unnecessary dynamic lights/shadows;
- disable processing for dormant nodes;
- keep UI and scene complexity visible in separate budgets when useful.

---

## 16. Common failure patterns

### Giant scene

Symptom: one scene owns every feature and is hard to test/reuse.

Fix: split by cohesive ownership, not arbitrary file size.

### Giant Autoload

Symptom: every script talks to one global object.

Fix: keep canonical coordination global only when necessary; move focused rules to services/resources/classes.

### UI as domain

Symptom: button handler contains gameplay/business formulas.

Fix: command boundary + domain service.

### Hardcoded NodePath coupling

Symptom: reusable scene breaks when moved.

Fix: dependency injection/signals/local ownership.

### Node for data

Symptom: thousands of Nodes that only hold fields.

Fix: Resource/RefCounted/plain class.

### Blind optimization

Symptom: complexity increases but frame time does not improve.

Fix: measure first, then target the bottleneck.

### Headless = visually accepted

Symptom: CI is green but scene is clipped/blank/poorly framed.

Fix: capture/render in a display-capable environment and review exact-head evidence.

### Fix export output by hand

Symptom: exported bundle diverges from source and regenerating loses the fix.

Fix: repair the Godot project/export process.

---

## 17. Learning loop

When a Godot problem teaches a reusable lesson:

```text
problem
-> reproduce
-> consult official stable docs
-> inspect project example
-> isolate root cause
-> implement smallest fix
-> validate
-> extract durable lesson here
```

Only persist knowledge that is likely to help another project/session.

Project-specific state belongs in that project's own spec/handoff.

---

## Reference sources

Official stable documentation:

- Best practices: https://docs.godotengine.org/en/stable/tutorials/best_practices/index.html
- Scene organization: https://docs.godotengine.org/en/stable/tutorials/best_practices/scene_organization.html
- Autoloads versus regular nodes: https://docs.godotengine.org/en/stable/tutorials/best_practices/autoloads_versus_regular_nodes.html
- GDScript: https://docs.godotengine.org/en/stable/tutorials/scripting/gdscript/
- Static typing: https://docs.godotengine.org/en/stable/tutorials/scripting/gdscript/static_typing.html
- CLI: https://docs.godotengine.org/en/stable/tutorials/editor/command_line_tutorial.html
- Performance: https://docs.godotengine.org/en/stable/tutorials/performance/index.html

Field reference:

- `az1nn/growing-rio`
- `project.godot`
- `docs/ARCHITECTURE.md`
- Feature 012 Godot-native V1 visual-system documentation/tests
