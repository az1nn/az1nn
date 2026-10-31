import { readFileSync, existsSync } from "node:fs";
import { strict as assert } from "node:assert";
import { resolve, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const root = resolve(dirname(fileURLToPath(import.meta.url)), "../../..");
const read = (path) => readFileSync(resolve(root, path), "utf8");
const file = (path) => existsSync(resolve(root, path));

const skill = read("skills/skr/SKILL.md");
const siga = read(".github/skills/siga/SKILL.md");
const agents = read("AGENTS.md");
const scenarios = read("skills/skr/tests/scenarios.md");
const decisions = read("specs/001-skr-grilling/decisions.md");
const scopeDecisions = read("specs/002-siga-verification/decisions.md");
const roadmap = read("skills/ROADMAP.md");
const tasks = read("specs/001-skr-grilling/tasks.md");
const evidenceEarly = read("specs/001-skr-grilling/evidence/skr-siga-2026-10-09.md");
const evidenceRecent = read("specs/001-skr-grilling/evidence/skr-siga-2026-10-30.md");

let assertions = 0;
function check(name, fn) {
  assertions += 1;
  try { fn(); console.log("PASS " + name); }
  catch (e) { console.error("FAIL " + name + ": " + e.message); process.exitCode = 1; }
}

check("single SIGA authority and three modes", () => {
  assert.match(siga, /exatamente um/);
  for (const m of ["MODE A — RESUME", "MODE B — WATCH", "MODE C — ADVANCE"]) assert.ok(siga.includes(m));
  assert.ok(agents.includes(".github/skills/siga/SKILL.md"));
  assert.ok(!file("skills/siga/SKILL.md"));
});
check("SKR is uniquely routed, never another SIGA", () => {
  assert.ok(agents.includes("skills/skr/SKILL.md"));
  assert.ok(skill.includes("canonical_source: \"skills/skr/SKILL.md\""));
  assert.ok(skill.includes("It is NOT another orchestrator"));
  assert.ok(!file(".github/skills/skr/SKILL.md"));
});
check("all sixteen scenario IDs exist once", () => {
  const ids = Array.from(scenarios.matchAll(/^\\| (S\\d{2}) \\|/gm), m => m[1]);
  assert.deepEqual(ids, Array.from({ length: 16 }, (_, i) => "S" + String(i + 1).padStart(2, "0")));
});
check("scenario entries have distinct actual inputs, expectations and gates", () => {
  const rows = scenarios.split("\n").filter(x => /^\\| S\\d{2} \\|/.test(x));
  assert.equal(rows.length, 16);
  for (const row of rows) {
    const columns = row.split("|").map(x => x.trim()).filter(Boolean);
    assert.equal(columns.length, 4, "Incorrect matrix columns in " + row);
    assert.ok(columns.slice(1).every(x => x.length > 15), "Missing scenario acceptance detail: " + row);
  }
});
check("Outro-only, hybrid and contradictory answers remain valid inputs", () => {
  assert.ok(skill.includes("Outro alone"));
  assert.ok(skill.includes("A + C + Outro"));
  assert.ok(skill.includes("Never drop free text"));
  assert.ok(skill.includes("DECISION_CONFLICT"));
  assert.ok(scenarios.includes("S03 | choose A + C + Outro"));
  assert.ok(scenarios.includes("S04 | Outro: custom solution"));
  assert.ok(scenarios.includes("S14 | human answer contains contradictory Outro"));
});
check("input UI is nonexclusive with optional multiline Outro", () => {
  assert.ok(skill.includes("independent checkboxes/multi-select"));
  assert.ok(skill.includes("textarea"));
  assert.ok(skill.includes("Never use exclusive radio-only"));
  assert.ok(skill.includes("hosts without interactive controls"));
});
check("no self-ratification or approval by silence", () => {
  assert.ok(skill.includes("cannot self-ratify"));
  assert.ok(skill.includes("HUMAN_GATE"));
  assert.ok(skill.includes("Never infer approval") || decisions.includes("Never infer approval"));
  assert.ok(skill.includes("Never drop free text"));
  assert.ok(scenarios.includes("S05 | constitutional"));
});
check("existing SIGA-G1=D human choice preserved", () => {
  assert.ok(scopeDecisions.includes("SIGA-G1"));
  assert.ok(scopeDecisions.includes("D APPROVED"));
  assert.ok(roadmap.includes("G1 D APPROVED"));
  assert.ok(!roadmap.includes("G1 HUMAN_GATE"));
});
check("roadmap P0/P1 order and branch isolation", () => {
  const p0=roadmap.indexOf("| P0 | SKR"),p1=roadmap.indexOf("| P1 after SKR P0");
  assert.ok(p0>=0 && p1>p0);
  assert.ok(roadmap.includes("PR #18"));
  assert.ok(!file("skills/godot/CONSTITUTION.md"), "PR #18 cannot be treated as merged");
});
check("provenance is not behavioral completion", () => {
  for (const e of [evidenceEarly,evidenceRecent]) {
    assert.ok(e.includes("NOT_RUN"));
    assert.ok(e.includes("S01"));
  }
  assert.ok(evidenceRecent.includes("S02"));
  assert.ok(evidenceRecent.includes("G1=D"));
  assert.ok(evidenceRecent.includes("GitHub"));
});
check("T13 behavioral and T14 review are still explicit gates", () => {
  assert.match(tasks, /\\[ \\] T13 Run real SKR/);
  assert.match(tasks, /\\[ \\] T14 Review/);
  assert.ok(scenarios.includes("MANUAL acceptance exercises"));
});
check("CG M0 merger is documentation only, not a new skill", () => {
  assert.ok(file(".github/skills/siga/context-guardian.md"));
  assert.ok(!file("skills/context-guardian/SKILL.md"));
  assert.ok(read(".github/skills/siga/context-guardian.md").includes("NOT ACTIVE"));
});
console.log("SKR integrity assertions: " + assertions + "; failures: " + (process.exitCode ? 1 : 0));
