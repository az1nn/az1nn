---
name: godot
version: "1"
description: Verify-first Godot engineering command for project inspection, implementation, debugging, validation, export, profiling and learning.
canonical_source: ".github/skills/godot/SKILL.md"
reference_project: "az1nn/growing-rio"
---

# GODOT v1

## Purpose

`Godot` is the engine-specialist command for Godot work.

It complements SIGA:

- **SIGA** owns repository truth, continuation, scope, branches/PRs, gates and delivery.
- **GODOT** owns Godot-specific diagnosis, architecture, GDScript, scenes, resources, rendering, tests, profiling and export.
- Repository state always outranks chat memory.

The reference implementation for practical questions is `az1nn/growing-rio`. It is evidence, not universal law. Official stable Godot documentation remains the API/CLI authority.

## Trigger

Treat a standalone `Godot` command, or `Godot <subcommand>`, as an explicit request to load this skill.

Examples:

```text
Godot
Godot status
Godot validate
Godot run
Godot scene res://scenes/foo.tscn
Godot script res://tests/foo_test.gd
Godot export "Web" build/web/index.html
Godot debug
Godot profile
Godot learn scenes
Godot diagnose "scene renders black"
```

A prose mention of Godot does not automatically invoke the command.

## Verify-first

Before suggesting or performing a mutation:

1. locate `project.godot`;
2. read the configured Godot feature/version;
3. inspect main scene, Autoloads and renderer;
4. inspect relevant scene/script/resource files;
5. inspect export presets when export/Web is involved;
6. inspect repository-local validation/tests and CI;
7. inspect the active spec/task/handoff when present;
8. use `growing-rio` only for a concrete implementation pattern or unresolved question;
9. use official stable Godot docs when engine behavior/CLI/API is uncertain.

Do not assume a project is using Forward+, Mobile or GL Compatibility. Read `project.godot`.

## Commands

### `Godot` / `Godot status`

Produce the smallest useful engine snapshot:

- Godot version/feature;
- renderer;
- main scene;
- Autoloads;
- export presets;
- test/validation entry points;
- active Godot task;
- current blocker or next action.

Do not mutate unless the request or active SIGA task requires it.

### `Godot run [scene]`

Run the project or a specific scene.

Canonical CLI forms:

```bash
godot --path .
godot --path . --scene res://scenes/example.tscn
```

Use a graphical/display-capable environment for visual acceptance. Headless execution is not evidence of rendered quality.

### `Godot import`

Import project resources and surface import/parser failures:

```bash
godot --headless --path . --import
```

### `Godot script <script>`

Run a project script:

```bash
godot --headless --path . --script res://path/to/script.gd
```

For a single script parse check:

```bash
godot --headless --path . --script res://path/to/script.gd --check-only
```

Do not claim `--check-only` validates the entire project; it is a script-oriented parse check.

### `Godot validate`

Prefer repository-defined gates over invented generic ones.

Order:

1. repository validation script/test suite;
2. targeted Godot tests for the changed behavior;
3. import/parser sanity;
4. export/build gate when delivery depends on export;
5. rendered/interaction evidence for player-visible changes;
6. exact-head CI when the repository uses it.

In `growing-rio`, the canonical CI entry point is repository-defined and runs from GitHub Actions; do not replace it with a weaker generic command.

### `Godot export <preset> <path>`

Release export:

```bash
godot --headless --path . --export-release "<preset>" <output-path>
```

Debug export:

```bash
godot --headless --path . --export-debug "<preset>" <output-path>
```

Pack only:

```bash
godot --headless --path . --export-pack "<preset>" <output.pck>
```

The preset must exist in `export_presets.cfg`. Export templates must be installed or explicitly configured.

### `Godot debug [scene]`

Start with observable facts:

```bash
godot --path . --debug
godot --path . --verbose
godot --path . --log-file ./godot.log
```

Use relevant visual debug flags only when they match the symptom, for example collision or navigation overlays.

Diagnosis order:

```text
reproduce -> isolate -> inspect errors -> inspect scene ownership/state
-> confirm resources/imports -> test smallest fix -> re-run exact gate
```

### `Godot profile`

Measure before optimizing.

Useful engine options include:

```bash
godot --path . --profiling
godot --path . --gpu-profile
godot --path . --print-fps
```

Choose CPU/GPU/frame/resource measurements that match the suspected bottleneck. Never optimize from intuition alone.

### `Godot learn <topic>`

Research and persist reusable knowledge.

Process:

1. read the smallest relevant official stable Godot documentation;
2. inspect `growing-rio` for field evidence when useful;
3. separate official behavior from project-specific convention;
4. update `docs/godot/KNOWLEDGE.md` only with durable lessons;
5. include an anti-pattern or failure mode when it improves future decisions.

### `Godot diagnose <symptom>`

Classify first:

- project/config;
- GDScript/parser/type;
- scene-tree/lifecycle;
- signal/input;
- resource/import;
- rendering/material/shader;
- physics/navigation;
- persistence/state;
- export/Web/platform;
- performance.

Then inspect only the relevant slice.

## Architecture defaults

These are defaults, not dogma.

### Scenes

Prefer cohesive, reusable scenes with minimal knowledge of their parent environment.

- local presentation state stays local;
- external dependencies are injected or exposed through explicit APIs;
- signals are good for event notification and decoupled upward communication;
- avoid deep cross-scene `get_node()` coupling.

### Autoloads

Use Autoload for genuinely project-wide lifetime/coordination, not as a dumping ground for all logic.

A useful pattern demonstrated in `growing-rio`:

```text
UI scenes
  -> explicit read/command boundary
  -> canonical state/orchestrator Autoload
  -> domain services/resources
```

The lesson is the boundary, not the project name: canonical state may be global, but domain rules should remain testable and UI-independent where practical.

### Data and logic

Do not use Nodes for every data object.

Prefer:

- `Resource` for serializable/editor-friendly definitions and reusable data;
- `RefCounted` or plain classes for lightweight domain logic/data where scene-tree behavior is unnecessary;
- Nodes when lifecycle, scene tree, processing, input, transforms or engine services justify them.

### UI and domain state

UI should not duplicate domain formulas.

Prefer:

```text
UI reads snapshot/view data
UI sends explicit commands
domain/state layer owns rules
```

This makes headless testing, save migration and renderer changes easier.

## GDScript defaults

- follow the Godot GDScript style guide;
- use static typing on public/domain boundaries and where it improves safety/readability;
- declare return types on non-trivial functions;
- use stable IDs instead of display text for persisted/domain identity;
- keep callbacks small; delegate rules to focused functions/services;
- avoid magic node paths across scene ownership boundaries;
- document non-obvious invariants, not obvious syntax.

## Rendering defaults

Renderer choice is product/platform architecture.

For Web/mobile projects, verify compatibility and budgets before adopting renderer-specific features.

`growing-rio` currently demonstrates a Godot-native GL Compatibility path for Web/mobile. It also demonstrates a useful separation for stylized rendering: reduce the 3D scene raster inside a `SubViewport` while keeping UI full resolution.

Do not generalize that pixel-treatment decision to projects that do not need it.

## Testing defaults

A Godot change is not complete merely because the editor opens.

Use the strongest applicable evidence:

- pure/domain tests for deterministic rules;
- headless Godot tests for engine-integrated behavior;
- scene interaction tests for input/navigation;
- structural validators for resource/contract invariants;
- import/export gates;
- visual capture for player-visible rendering;
- exact-head CI before merge when the repository requires it.

## Performance defaults

Measure first.

Prioritize:

- frame time and stalls;
- draw calls/material changes;
- geometry count;
- texture size/format;
- dynamic lights/shadows;
- script hotspots;
- repeated allocations;
- unnecessary active processing;
- duplicated nodes/resources.

Prefer shared/reused resources when semantics allow. Do not trade maintainability for micro-optimization without measurements.

## Anti-patterns

Avoid by default:

- one giant scene owning all behavior;
- one giant Autoload owning all project logic;
- UI scripts implementing business/domain rules;
- copying formulas across scenes;
- using Nodes purely as data containers;
- hardcoding parent/sibling node paths into reusable subscenes;
- committing generated export output as hand-authored source unless the repository explicitly requires it;
- claiming visual acceptance from headless execution;
- performance changes without before/after measurement;
- changing renderer because a scene is difficult to implement.

## Reference hierarchy

For Godot questions:

```text
current repository reality
> active spec/architecture
> official stable Godot documentation
> growing-rio proven patterns
> other examples
> chat/model memory
```

## Persistent knowledge

Reusable Godot learning belongs in:

```text
docs/godot/KNOWLEDGE.md
docs/godot/COMMANDS.md
```

Project-specific state remains in that project's own specs/handoffs.

## Final invariant

```text
GODOT = VERIFY PROJECT
      -> CLASSIFY ENGINE CONCERN
      -> USE OFFICIAL API/CLI TRUTH
      -> APPLY REPOSITORY ARCHITECTURE
      -> IMPLEMENT THE SMALLEST COHERENT CHANGE
      -> TEST / RENDER / PROFILE AS APPLICABLE
      -> PERSIST REUSABLE LEARNING
```
