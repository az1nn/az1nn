# Repository Agent Instructions

## SIGA

When the user sends the standalone command `Siga`, load and follow the repository-canonical protocol at:

`.github/skills/siga/SKILL.md`

That file is the **single canonical definition** of SIGA for this repository.

If SIGA identifies a Godot-specific task, load the repository-canonical Godot specialist at:

`.github/skills/godot/SKILL.md`

SIGA keeps ownership of repository truth, continuation classification, validation, merge safety and handoff. GODOT owns the engine-specific reasoning and implementation.

## GODOT

When the user sends `Godot` or `Godot <subcommand>`, load:

`.github/skills/godot/SKILL.md`

Supported specialist commands include:

```text
Godot
Godot status
Godot run [scene]
Godot import
Godot script <path>
Godot validate
Godot export <preset> <path>
Godot debug [scene]
Godot profile
Godot learn <topic>
Godot diagnose <symptom>
```

Use `docs/godot/COMMANDS.md` for the compact CLI field guide and `docs/godot/KNOWLEDGE.md` for durable engineering practices.

## Skill catalog

Use `.github/skills/README.md` for the concise map of canonical and project-local specialist skills, including when each should be used.

## Persistence

Do not copy SIGA or project operational state into ChatGPT memory or treat chat/model memory as persistent state. Reconstruct operational state from the real system and repository artifacts according to the active protocol.

Do not duplicate full skill definitions in this file; keep canonical implementations under `.github/skills/`.
