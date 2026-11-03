# Repository Agent Instructions

## SIGA

When the user sends the standalone command `Siga`, load and follow the repository-canonical protocol at:

`.github/skills/siga/SKILL.md`

That file is the **single canonical definition** of SIGA for this repository.

If SIGA identifies a Godot-specific task, load the repository-canonical Godot specialist at:

`.github/skills/godot/SKILL.md`

SIGA keeps ownership of repository truth, continuation classification, validation, merge safety and handoff. GODOT owns the engine-specific reasoning and implementation.

## SKR — focused skill-tree grilling

When the user sends SKR <NOME_DA_SKILL>, load the **single canonical** SKR at:

skills/skr/SKILL.md

Discover the focused skill and its actual tree in the checked-out repository/ref; audit routing, authority, contracts, tests, evidence and handoff. Always use Spec Kit and sync outcomes to the target project's existing roadmap. Include Outro free text and support hybrid choices; batch safe decisions without bypassing genuine human gates.

SKR is a facilitation shortcut, not a second SIGA or an override of specialist authority.

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

Do not duplicate full skill definitions in this file. SIGA and engine-specific GODOT are canonical in `.github/skills/`; SKR is canonical in `skills/skr/SKILL.md`.
