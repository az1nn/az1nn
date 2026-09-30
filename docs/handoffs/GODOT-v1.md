# CAVEMAN HANDOFF v1 — GODOT v1

APP: az1nn/az1nn agent toolkit
WORKSTREAM: GODOT v1
STATE: DELIVERED
MODE: ADVANCE
CANONICAL SOURCE: .github/skills/godot/SKILL.md

CURRENT VERSION / HEAD: b77436e3ecb66bbfce9a23c9dc03b4d006e98649
BASE: main
BRANCH / ENV: main
PR / MR / TASK: PR #16 merged
SPEC / ADR: documentation/skill capability; no runtime product behavior changed

DONE:
- repository-canonical GODOT v1 specialist added;
- Godot CLI field guide added;
- durable Godot engineering knowledge base added;
- AGENTS.md routes SIGA -> GODOT and direct Godot commands;
- concise skill catalog added;
- growing-rio established as practical field reference, while official stable Godot docs remain engine/API authority.

VERIFY:
- PR #16 merged with expected-head guard;
- feature branch was 6 commits ahead / 0 behind before merge;
- GitHub profile preview reported deployed for candidate 6e96910f304d;
- Vercel reported only api-deployments-free-per-day capacity exhaustion, not a source/build defect.

GATES:
- repository delivery: PASS;
- provider deployment parity: UNVERIFIED while Vercel quota is exhausted.

BLOCKERS:
- none for GODOT v1 usage.

INVARIANTS:
- current repository reality > active spec/architecture > official Godot docs > growing-rio examples > chat/model memory;
- project-specific skill state stays in the project repository;
- headless execution is not rendered visual acceptance.

NEXT:
- invoke `Godot` or `Godot <subcommand>` on Godot tasks;
- use `Godot learn <topic>` to add only durable, reusable lessons to docs/godot/KNOWLEDGE.md.

VERIFY-FIRST:
Re-read current main, .github/skills/godot/SKILL.md, docs/godot/COMMANDS.md, docs/godot/KNOWLEDGE.md and the target project's project.godot before applying engine-specific work.
