# Portable Godot Skill Tree

> Status: WORKING DRAFT — under active grilling.
>
> Repository location: `/skills/godot/`
>
> This tree is portable behavior architecture. Project state, specs, tasks, assets, evidence and reports belong to each consuming project.

## Purpose

This directory defines a reusable hierarchy of specialist skills for game development. It deliberately avoids project-specific names, scene IDs, branches, assets, lore, infrastructure and operational state.

Core separation:

```text
SKILL    = behavior / authority / workflow
SPEC     = intent
TASK     = work
STATE    = current situation
EVIDENCE = proof
REPORT   = handoff
ASSETS   = project data
```

## Tree

```text
                         ORCHESTRATOR
                              |
       +----------+-----------+-----------+----------+
       |          |           |           |          |
       v          v           v           v          v
     DESIGN      LORE       SCENE        ART        ARCH
       |          |           |           |          |
       +----------+-----------+-----------+----------+
                              |
                           RUNTIME
                              |
                         INSPECTOR
                              |
                         REPORTER
                              |
                             NEXT
```

`RUNTIME/BUILD` is not an authority. It is an execution and evidence substrate.

## Skill catalog

| Skill | Primary authority |
|---|---|
| ORCHESTRATOR | Process, reconciliation, routing, ownership, sequencing and operational closure |
| DESIGN | Mechanics, rules, systems, economy, progression and intended player experience |
| LORE | Worldbuilding, narrative, characters, setting coherence and fictional canon |
| SCENE | Playable/spatial composition, camera, navigation, interaction wiring, collision, spawn and layout |
| ART | Visual language, assets, materials, textures, aesthetic lighting, composition, silhouette, palette and visual consistency |
| ARCH | Code architecture, structural quality, dependencies, internal APIs, persistence, networking, security, refactors, tests, technical performance and engine-level systems |
| INSPECTOR | Evidence-based verification against explicit criteria and global critical invariants |
| REPORTER | Compact, resumable operational handoff |

## Canonical execution pipeline

```text
RECONCILE
   |
CLASSIFY
   |
EXECUTE
   |
VERIFY
   |
HANDOFF
```

Minimum classification states:

```text
RESUME
WATCH
ADVANCE
BLOCKED
HUMAN_GATE
```

Additional explicit states defined by the constitution include `SPEC_GAP`, `DOMAIN_CONFLICT`, `EXECUTION_LOOP`, `INSUFFICIENT_EVIDENCE`, `CRITICAL_FINDING` and ownership lifecycle states.

## Relationship to the existing Godot command

The repository already contains `.github/skills/godot/SKILL.md`, an engine-focused Godot engineering command.

This directory is different:

- `.github/skills/godot/` = existing engine specialist command;
- `/skills/godot/` = portable multi-skill game-development architecture under validation.

Do not silently merge their responsibilities.

## Portability rule

Copy:

- architecture;
- authorities;
- protocols;
- workflows;
- gates;
- contracts;
- validation rules;
- failure rules.

Do not copy:

- project names;
- scene names;
- assets;
- roadmap;
- tasks;
- spec IDs;
- branches;
- prior game architecture;
- visual decisions;
- lore;
- URLs;
- deploy/infra;
- paths;
- operational state.

## Files

- [CONSTITUTION.md](./CONSTITUTION.md)
- [orchestrator/SKILL.md](./orchestrator/SKILL.md)
- [design/SKILL.md](./design/SKILL.md)
- [lore/SKILL.md](./lore/SKILL.md)
- [scene/SKILL.md](./scene/SKILL.md)
- [art/SKILL.md](./art/SKILL.md)
- [arch/SKILL.md](./arch/SKILL.md)
- [inspector/SKILL.md](./inspector/SKILL.md)
- [reporter/SKILL.md](./reporter/SKILL.md)

## Definition of success

A clean agent with no knowledge of a previous game must be able to discover project state, select valid work, route it to the correct authority, execute, obtain evidence, accept/reject correctly, recognize real human gates, produce a resumable handoff and continue without hidden chat context.
