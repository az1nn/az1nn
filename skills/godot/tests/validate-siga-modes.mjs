import assert from "node:assert/strict";
import { readFileSync } from "node:fs";

const repositoryRoot = new URL("../../../", import.meta.url);
const read = (path) => readFileSync(new URL(path, repositoryRoot), "utf8");

const siga = read(".github/skills/siga/SKILL.md");
const readme = read("skills/godot/README.md");
const orchestrator = read("skills/godot/orchestrator/SKILL.md");
const constitution = read("skills/godot/CONSTITUTION.md");
const audit = read("skills/godot/SIGA-COMPATIBILITY-AUDIT.md");

const expectedModes = ["RESUME", "WATCH", "ADVANCE"];
let checks = 0;
function check(name, test) {
  test();
  checks += 1;
  process.stdout.write("PASS " + name + "\n");
}

function classificationBlock(source, introduction) {
  const offset = source.indexOf(introduction);
  assert.notEqual(offset, -1, "Missing exact mode section: " + introduction);
  const segment = source.slice(offset);
  const match = segment.match(/```text\s*\n([\s\S]*?)\n```/);
  assert.ok(match, "Missing text mode code fence after " + introduction);
  return match[1].trim().split(/[|\n]/).map((x) => x.trim()).filter(Boolean);
}

check("SIGA canonical source retains exactly 3 modes", () => {
  for (const mode of ["### MODE A — RESUME", "### MODE B — WATCH", "### MODE C — ADVANCE"]) {
    assert.ok(siga.includes(mode), "Missing " + mode);
  }
  assert.ok(siga.includes("exatamente um"), "SIGA must classify into one mode");
});

check("Godot README classification matches SIGA", () => {
  assert.deepEqual(classificationBlock(readme, "**Exactly three SIGA continuation modes**"), expectedModes);
});
check("Orchestrator classification matches SIGA", () => {
  assert.deepEqual(classificationBlock(orchestrator, "**Continuation classification (exactly one of three canonical SIGA modes):**"), expectedModes);
});
check("Blocked and human gate are auxiliary, not fourth/fifth modes", () => {
  const disposition = classificationBlock(orchestrator, "**Auxiliary gate/disposition (not a classification mode):**");
  assert.deepEqual(disposition, ["BLOCKED", "HUMAN_GATE"]);
  assert.ok(readme.includes("Auxiliary dispositions, never additional classification modes"));
  assert.ok(!/RESUME\s*[|,]\s*WATCH\s*[|,]\s*ADVANCE\s*[|,]\s*(?:BLOCKED|HUMAN_GATE)/.test(readme + "\n" + orchestrator));
});
check("Constitution preserves gates and requires independent ratification", () => {
  assert.ok(constitution.includes("M04-C01 — option A"));
  assert.ok(constitution.includes("exactly** `RESUME`, `WATCH`, `ADVANCE`"));
  assert.ok(constitution.includes("not fourth or fifth modes"));
  assert.ok(constitution.includes("Constitutional changes require explicit HUMAN approval"));
});
check("Audited human approval does not authorize merge", () => {
  assert.ok(audit.includes("M04-C01 is **RESOLVED FOR DOCUMENTARY CONTRACT**"));
  assert.ok(audit.includes("other §25 authority/gate changes"));
  assert.ok(audit.includes("MERGE NO-GO"));
});
process.stdout.write(`Contract checks: ${checks}; failures: 0\n`);
