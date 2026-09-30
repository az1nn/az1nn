# Godot command field guide

Portable command reference for Godot 4.x repository work.

> Verify the installed/editor version with `godot --version`. Unknown CLI options may be ignored depending on the binary/build, so prefer the official stable reference for the project version.

## Project and editor

```bash
godot --version
godot --help
godot --path .
godot --path . --editor
godot --upwards
```

- `--path <dir>`: select the directory containing `project.godot`.
- `--upwards`: search parent directories for the project.
- `--editor`: open the editor.

## Run

```bash
godot --path .
godot --path . --scene res://scenes/example.tscn
godot --path . --debug
godot --path . --verbose
godot --path . --log-file ./godot.log
```

Use graphical execution for rendered acceptance.

## Headless / CI

```bash
godot --headless --path . --import
godot --headless --path . --script res://tools/check.gd
godot --headless --path . --script res://tools/check.gd --check-only
```

Notes:

- `--headless` is appropriate for CI and script/test tooling.
- `--import` waits for resource import then exits.
- `--check-only` is used with `--script`; it is not a whole-project test suite.
- Prefer the repository's own validation/test command when it exists.

## Export

```bash
godot --headless --path . --export-release "Web" build/web/index.html
godot --headless --path . --export-debug "Web" build/web/index.html
godot --headless --path . --export-pack "Web" build/game.pck
```

Requirements:

- matching preset in `export_presets.cfg`;
- required export templates installed/configured;
- output directory exists;
- validate the actual exported artifact when delivery depends on it.

## Profiling and rendering diagnostics

```bash
godot --path . --profiling
godot --path . --gpu-profile
godot --path . --print-fps
godot --path . --debug-collisions
godot --path . --debug-navigation
```

Use the smallest flag set that matches the problem. Measure before tuning.

## Useful GODOT skill commands

These are repository-agent commands, not engine flags:

| Command | Use |
|---|---|
| `Godot` / `Godot status` | Inspect engine/project state and identify the next Godot action. |
| `Godot run [scene]` | Run the project or a target scene. |
| `Godot import` | Check imports/parser startup in headless mode. |
| `Godot script <path>` | Execute/check a project GDScript tool or test. |
| `Godot validate` | Run repository-defined Godot gates plus targeted evidence. |
| `Godot export <preset> <path>` | Build an export from the checked-in preset. |
| `Godot debug [scene]` | Reproduce and diagnose a runtime/editor issue. |
| `Godot profile` | Capture performance evidence before optimization. |
| `Godot learn <topic>` | Research official docs + project evidence and update durable knowledge. |
| `Godot diagnose <symptom>` | Classify and isolate an engine-specific failure. |

## Official reference

- Command line: https://docs.godotengine.org/en/stable/tutorials/editor/command_line_tutorial.html
- Best practices: https://docs.godotengine.org/en/stable/tutorials/best_practices/index.html
- GDScript: https://docs.godotengine.org/en/stable/tutorials/scripting/gdscript/
- Performance: https://docs.godotengine.org/en/stable/tutorials/performance/index.html
