import { readFileSync, existsSync } from 'node:fs';
import { strict as assert } from 'node:assert';
import { resolve } from 'node:path';

const root = resolve(import.meta.dirname, '../../..');
const read = (name) => readFileSync(resolve(root, name), 'utf8');
const requiredFiles = [
  'skills/skr/SKILL.md',
  'AGENTS.md',
  '.github/skills/README.md',
  'skills/ROADMAP.md',
  'specs/001-skr-grilling/spec.md',
  'specs/001-skr-grilling/plan.md',
  'specs/001-skr-grilling/tasks.md',
  'specs/001-skr-grilling/decisions.md',
  'skills/skr/tests/scenarios.md'
];

let total = 0;
function check(name, fn) {
  total += 1;
  try {
    fn();
    process.stdout.write('PASS ' + name + '\n');
  } catch (err) {
    process.stderr.write('FAIL ' + name + ': ' + err.message + '\n');
    process.exitCode = 1;
  }
}
for (const file of requiredFiles) check('file: ' + file, () => assert.ok(existsSync(resolve(root, file))));

const skill = read('skills/skr/SKILL.md');
const agents = read('AGENTS.md');
const catalog = read('.github/skills/README.md');
const spec = read('specs/001-skr-grilling/spec.md');
const tasks = read('specs/001-skr-grilling/tasks.md');
const plan = read('specs/001-skr-grilling/plan.md');
const decisions = read('specs/001-skr-grilling/decisions.md');
const roadmap = read('skills/ROADMAP.md');
const scenarios = read('skills/skr/tests/scenarios.md');
const required = (source, needles) => {for (const needle of needles) assert.ok(source.includes(needle), 'Missing: ' + needle);};

check('SKR only one canonical definition', () => {
  assert.ok(skill.includes('canonical_source: "skills/skr/SKILL.md"'));
  assert.ok(agents.includes('skills/skr/SKILL.md'));
  assert.ok(catalog.includes('skills/skr/SKILL.md'));
  assert.ok(!existsSync(resolve(root, '.github/skills/skr/SKILL.md')));
});
check('invocation and tree audit', () => required(skill, ['SKR <NOME_DA_SKILL>', 'AUDIT THE WHOLE TREE', 'Invocation', 'Authority', 'Verification', 'Delivery']));
check('Outro must be available and can mix choices', () => required(skill, ['Outro:', 'A + C + Outro:', 'valid by itself', 'selected options and free-text additions separately']));
check('batch autonomy and human authority', () => required(skill, ['BATCH', 'AUTO_RESOLVED', 'HUMAN_GATE', 'cannot self-ratify', 'Never drop free text']));
check('Spec Kit and missing roadmap safety', () => required(skill, ['SPEC KIT IS MANDATORY', 'spec.md', 'plan.md', 'tasks.md', 'decision ledger', 'EXISTING roadmap', 'ROADMAP_MISSING']));
check('verification and provenance', () => required(skill, ['exact-HEAD CI', 'visual evidence', 'NOT_RUN', 'STALE', 'INSUFFICIENT_EVIDENCE', 'REJECT']));
check('resume and concurrency', () => required(skill, ['RESUME/WATCH/ADVANCE', 'claims/ownership', 'Continue from the first unresolved']));
check('routing leaves SIGA canonical', () => required(agents, ['.github/skills/siga/SKILL.md', 'skills/skr/SKILL.md']));
check('feature spec has 10 linked FRs', () => {
  for (let i=1;i<=10;i++) assert.ok(spec.includes('FR-' + String(i).padStart(2, '0')), 'Missing FR ' + i);
  for (let i=1;i<=11;i++) assert.ok(tasks.includes('T' + String(i).padStart(2,'0')), 'Missing T ' + i);
});
check('decisions and roadmap are traceable', () => required(decisions, ['SKR-D01', 'SKR-D07', 'Outr' + 'o verbatim', 'HUMAN_GATE']));
check('feature registered in roadmap', () => {
  required(roadmap, ['001-skr-grilling/spec.md', 'PR #18']);
  assert.match(roadmap, /existing roadmap/i, 'Missing existing roadmap policy');
});
check('plan distinguishes manual E2E from static test', () => required(plan, ['No Godot runtime', 'real prompt execution', 'independent branch']));
check('all negative/positive manual scenarios specified', () => {
  for (let i=1;i<=14;i++) assert.ok(scenarios.includes('S' + String(i).padStart(2,'0')), 'Missing scenario S' + i);
});
process.stdout.write('Contract checks: ' + total + '; failures: ' + (process.exitCode ?? 0) + '\n');
