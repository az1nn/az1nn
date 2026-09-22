import { PROFILE } from "../profile.config.js";

const errors = [];
const fail = (message) => errors.push(message);
const assert = (condition, message) => {
  if (!condition) fail(message);
};

assert(PROFILE && typeof PROFILE === "object", "PROFILE must export an object");
assert(PROFILE.owner?.handle, "owner.handle is required");
assert(Array.isArray(PROFILE.projects) && PROFILE.projects.length > 0, "projects must be a non-empty array");
assert(PROFILE.twin?.id, "twin.id is required");

const ids = new Set();
for (const project of PROFILE.projects || []) {
  assert(project.id, "every project requires an id");
  assert(project.name, `project ${project.id || "<unknown>"} requires a name`);
  assert(project.url, `project ${project.id || "<unknown>"} requires a url`);
  assert(Array.isArray(project.position) && project.position.length === 3, `project ${project.id || "<unknown>"} requires a 3D position`);
  assert(Number.isFinite(project.scale) && project.scale > 0, `project ${project.id || "<unknown>"} requires a positive scale`);

  if (project.id) {
    assert(!ids.has(project.id), `duplicate project id: ${project.id}`);
    ids.add(project.id);
  }
}

assert(!ids.has(PROFILE.twin?.id), `twin id collides with a project id: ${PROFILE.twin?.id}`);

for (const relation of PROFILE.relations || []) {
  assert(ids.has(relation.source), `relation source does not exist: ${relation.source}`);
  assert(ids.has(relation.target), `relation target does not exist: ${relation.target}`);
  assert(relation.source !== relation.target, `self relation is not allowed: ${relation.source}`);
  assert(typeof relation.label === "string" && relation.label.length > 0, `relation ${relation.source} -> ${relation.target} requires a label`);
  assert(Number.isFinite(relation.strength) && relation.strength >= 0 && relation.strength <= 1, `relation ${relation.source} -> ${relation.target} strength must be between 0 and 1`);
}

const states = PROFILE.twin?.states || {};
for (const requiredState of ["idle", "thinking", "building"]) {
  const state = states[requiredState];
  assert(state, `twin state is required: ${requiredState}`);
  if (!state) continue;
  assert(state.label, `twin state ${requiredState} requires a label`);
  assert(state.description, `twin state ${requiredState} requires a description`);
  assert(/^#[0-9a-f]{6}$/i.test(state.color || ""), `twin state ${requiredState} requires a six-digit hex color`);
  assert(/^#[0-9a-f]{6}$/i.test(state.emissive || ""), `twin state ${requiredState} requires a six-digit hex emissive color`);
  assert(Number.isFinite(state.intensity) && state.intensity >= 0, `twin state ${requiredState} requires a non-negative intensity`);
}

assert(Array.isArray(PROFILE.timeline) && PROFILE.timeline.length > 0, "timeline must be a non-empty array");
for (const item of PROFILE.timeline || []) {
  assert(item.phase, "every timeline entry requires phase");
  assert(item.title, `timeline ${item.phase || "<unknown>"} requires title`);
  assert(item.summary, `timeline ${item.phase || "<unknown>"} requires summary`);
}

try {
  const activityUrl = new URL(PROFILE.activity?.endpoint || "");
  assert(activityUrl.protocol === "https:", "activity endpoint must use HTTPS");
  assert(activityUrl.hostname === "api.github.com", "activity endpoint must stay on api.github.com");
} catch {
  fail("activity.endpoint must be a valid URL");
}

assert(Number.isInteger(PROFILE.activity?.maxNodes) && PROFILE.activity.maxNodes > 0 && PROFILE.activity.maxNodes <= 50, "activity.maxNodes must be an integer between 1 and 50");

if (errors.length) {
  console.error("Profile graph validation failed:");
  for (const error of errors) console.error(`- ${error}`);
  process.exit(1);
}

console.log(`Profile graph valid: ${PROFILE.projects.length} projects, ${(PROFILE.relations || []).length} relations, ${PROFILE.timeline.length} timeline phases.`);
