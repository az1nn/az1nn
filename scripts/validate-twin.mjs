import { PROFILE } from "../profile.config.js";
import { resolveTwinQuery } from "../twin.model.mjs";

const failures = [];
const check = (condition, message) => {
  if (!condition) failures.push(message);
};

const project = resolveTwinQuery(PROFILE, "Tell me about OpenBand");
check(project.intent === "project", "OpenBand query should resolve as project intent");
check(project.evidence.includes("project:openband"), "OpenBand answer should expose project grounding");
check(project.actions.some((action) => action.type === "focus-project" && action.projectId === "openband"), "OpenBand answer should expose a focus action");

const relation = resolveTwinQuery(PROFILE, "How are CPXLABS Admin and MyHub connected?");
check(relation.intent === "relation", "two-project relation query should resolve as relation intent");
check(relation.text.includes("Spec + Graph Engineering"), "known CPXLABS Admin/MyHub relation should be grounded in its configured label");

const activity = resolveTwinQuery(PROFILE, "What are you building now?", {
  activity: [
    { type: "PushEvent", repo: "az1nn/openband", commits: 3 },
    { type: "PullRequestEvent", repo: "az1nn/openband", commits: 0 },
    { type: "PushEvent", repo: "az1nn/myhub", commits: 1 },
  ],
});
check(activity.intent === "activity", "current-work query should resolve as activity intent");
check(activity.text.includes("OpenBand"), "activity answer should rank matched public projects");
check(activity.text.includes("4 commit signals"), "activity answer should aggregate commit signals");

const focus = resolveTwinQuery(PROFILE, "Focus MyHub");
check(focus.actions.some((action) => action.type === "focus-project" && action.projectId === "myhub"), "focus query should produce a graph focus action");

const open = resolveTwinQuery(PROFILE, "Open PG Researcher on GitHub");
check(open.actions.some((action) => action.type === "open-repo" && action.projectId === "pg-researcher"), "open query should produce an allowlisted repository action");

const fallback = resolveTwinQuery(PROFILE, "Explain quantum gravity");
check(fallback.intent === "fallback", "un-grounded query should fail closed to fallback intent");
check(!fallback.actions.length, "un-grounded query must not invent actions");

const allowedActions = new Set(["focus-project", "open-repo", "show-view"]);
for (const sample of [project, relation, activity, focus, open, fallback]) {
  for (const action of sample.actions || []) {
    check(allowedActions.has(action.type), `unexpected Twin action type: ${action.type}`);
  }
}

if (failures.length) {
  console.error("Twin conversation validation failed:");
  failures.forEach((failure) => console.error(`- ${failure}`));
  process.exit(1);
}

console.log("Twin conversation model valid: project, relation, activity, focus, open and fail-closed cases passed.");
