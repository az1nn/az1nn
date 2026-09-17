const DEFAULT_SUGGESTIONS = [
  "What are you building now?",
  "How are CPXLABS Admin and MyHub related?",
  "Tell me about OpenBand",
  "Show recent activity",
];

function normalize(value = "") {
  return String(value)
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9+#./_-]+/g, " ")
    .trim();
}

function projectTerms(project) {
  return [project.id, project.name, ...(project.tags || [])]
    .map(normalize)
    .filter(Boolean);
}

function findProjects(profile, query) {
  const normalized = normalize(query);
  return (profile.projects || [])
    .map((project) => ({
      project,
      score: Math.max(
        ...projectTerms(project).map((term) => {
          if (!term) return 0;
          if (normalized === term) return 4;
          if (normalized.includes(term)) return term === normalize(project.id) || term === normalize(project.name) ? 3 : 1;
          const words = normalized.split(" ");
          return words.some((word) => word.length > 2 && term.includes(word)) ? 0.5 : 0;
        }),
      ),
    }))
    .filter(({ score }) => score > 0)
    .sort((a, b) => b.score - a.score)
    .map(({ project }) => project);
}

function projectByRepo(profile, repo = "") {
  const repoName = normalize(String(repo).split("/").pop());
  return (profile.projects || []).find((project) => normalize(project.id) === repoName || normalize(project.name) === repoName);
}

function connectedRelations(profile, projectId) {
  return (profile.relations || []).filter(
    (relation) => relation.source === projectId || relation.target === projectId,
  );
}

function relationLabel(profile, relation) {
  const source = profile.projects.find((project) => project.id === relation.source)?.name || relation.source;
  const target = profile.projects.find((project) => project.id === relation.target)?.name || relation.target;
  return `${source} → ${target}: ${relation.label}`;
}

function answer(text, { intent = "answer", actions = [], evidence = [], suggestions = [] } = {}) {
  return { text, intent, actions, evidence, suggestions };
}

function summarizeActivity(profile, activity = []) {
  if (!activity.length) {
    return {
      text: "Live GitHub activity is unavailable right now, so I can only use the configured project graph.",
      evidence: ["profile.projects"],
    };
  }

  const recent = activity.slice(0, 30);
  const perProject = new Map();
  let commitSignals = 0;

  for (const event of recent) {
    commitSignals += Number(event.commits || event.payload?.size || event.payload?.commits?.length || 0);
    const project = projectByRepo(profile, event.repo || event.repo?.name || "");
    if (!project) continue;
    const entry = perProject.get(project.id) || { project, events: 0, commits: 0 };
    entry.events += 1;
    entry.commits += Number(event.commits || event.payload?.size || event.payload?.commits?.length || 0);
    perProject.set(project.id, entry);
  }

  const ranked = [...perProject.values()].sort(
    (a, b) => b.events - a.events || b.commits - a.commits,
  );
  const leaders = ranked.slice(0, 3).map(({ project, events, commits }) =>
    `${project.name} (${events} event${events === 1 ? "" : "s"}${commits ? `, ${commits} commit signal${commits === 1 ? "" : "s"}` : ""})`,
  );

  return {
    text: `${recent.length} recent public GitHub events are visible${commitSignals ? `, with ${commitSignals} commit signals` : ""}.${leaders.length ? ` The strongest project signals are ${leaders.join("; ")}.` : ""}`,
    evidence: ["github.public_activity", ...ranked.slice(0, 3).map(({ project }) => `project:${project.id}`)],
    ranked,
  };
}

function describeProject(profile, project) {
  const relations = connectedRelations(profile, project.id);
  const relationText = relations.length
    ? ` It has ${relations.length} explicit graph connection${relations.length === 1 ? "" : "s"}: ${relations.map((relation) => relationLabel(profile, relation)).join("; ")}.`
    : " It currently has no explicit project-to-project relation in the public graph.";
  const tags = project.tags?.length ? ` Stack/signals: ${project.tags.join(", ")}.` : "";

  return answer(
    `${project.name} is a ${project.status || "tracked"} ${project.category || "project"}. ${project.short}${tags}${relationText}`,
    {
      intent: "project",
      actions: [
        { type: "focus-project", projectId: project.id, label: `Focus ${project.name}` },
        { type: "open-repo", projectId: project.id, label: "Open repository" },
      ],
      evidence: [`project:${project.id}`, ...relations.map((relation) => `relation:${relation.source}->${relation.target}`)],
      suggestions: [`How is ${project.name} connected?`, `Open ${project.name}`],
    },
  );
}

export function getTwinSuggestions(profile) {
  return profile.conversation?.suggestions?.length
    ? profile.conversation.suggestions
    : DEFAULT_SUGGESTIONS;
}

export function resolveTwinQuery(profile, rawQuery, context = {}) {
  const query = String(rawQuery || "").trim();
  const normalized = normalize(query);
  const activity = Array.isArray(context.activity) ? context.activity : [];
  const matchedProjects = findProjects(profile, query);
  const primary = matchedProjects[0];

  if (!normalized) {
    return answer("Ask me about projects, relationships, recent GitHub activity, the engineering timeline, or a specific repository.", {
      intent: "help",
      suggestions: getTwinSuggestions(profile),
    });
  }

  if (/^(hi|hello|hey|ola|oi|e ai|eai)\b/.test(normalized)) {
    return answer(
      `I'm the public AI Twin interface for ${profile.owner?.name || profile.owner?.handle || "AZ1NN"}. In V0.4 I answer from the profile graph and public GitHub activity; I do not use a remote model or private data.`,
      { intent: "intro", evidence: ["profile.owner", "profile.twin"], suggestions: getTwinSuggestions(profile) },
    );
  }

  if (/\b(open|abrir|repo|repository|github)\b/.test(normalized) && primary) {
    return answer(`I can open ${primary.name}'s public repository.`, {
      intent: "open",
      actions: [{ type: "open-repo", projectId: primary.id, label: `Open ${primary.name} ↗` }],
      evidence: [`project:${primary.id}`],
    });
  }

  if (/\b(focus|foco|show me|take me|ir para|mostrar)\b/.test(normalized) && primary) {
    return answer(`Focusing the living graph on ${primary.name}.`, {
      intent: "focus",
      actions: [{ type: "focus-project", projectId: primary.id, label: `Focus ${primary.name}` }],
      evidence: [`project:${primary.id}`],
    });
  }

  if (/\b(activity|recent|commits?|github|working now|building now|agora|atividade|commits?|trabalhando)\b/.test(normalized)) {
    const summary = summarizeActivity(profile, activity);
    return answer(summary.text, {
      intent: "activity",
      actions: [{ type: "show-view", view: "activity", label: "Open activity view" }],
      evidence: summary.evidence,
      suggestions: summary.ranked?.slice(0, 2).map(({ project }) => `Tell me about ${project.name}`) || [],
    });
  }

  if (/\b(relation|relations|related|relationship|connect|connected|connection|graph|relacao|relacoes|conect|liga)\b/.test(normalized)) {
    if (matchedProjects.length >= 2) {
      const [a, b] = matchedProjects;
      const direct = (profile.relations || []).filter(
        (relation) =>
          (relation.source === a.id && relation.target === b.id) ||
          (relation.source === b.id && relation.target === a.id),
      );
      if (direct.length) {
        return answer(`The public graph connects ${a.name} and ${b.name} directly: ${direct.map((relation) => relation.label).join("; ")}.`, {
          intent: "relation",
          actions: [{ type: "show-view", view: "relations", label: "Open graph view" }],
          evidence: direct.map((relation) => `relation:${relation.source}->${relation.target}`),
        });
      }
      return answer(`${a.name} and ${b.name} do not currently have a direct edge in the public graph. They may still be connected through another project.`, {
        intent: "relation",
        actions: [{ type: "show-view", view: "relations", label: "Inspect graph" }],
        evidence: [`project:${a.id}`, `project:${b.id}`],
      });
    }

    if (primary) {
      const relations = connectedRelations(profile, primary.id);
      return answer(
        relations.length
          ? `${primary.name} has ${relations.length} explicit connection${relations.length === 1 ? "" : "s"}: ${relations.map((relation) => relationLabel(profile, relation)).join("; ")}.`
          : `${primary.name} has no explicit graph connection yet.`,
        {
          intent: "relation",
          actions: [{ type: "focus-project", projectId: primary.id, label: `Focus ${primary.name}` }],
          evidence: [`project:${primary.id}`, ...relations.map((relation) => `relation:${relation.source}->${relation.target}`)],
        },
      );
    }

    return answer(`The graph has ${(profile.relations || []).length} explicit project relationships: ${(profile.relations || []).map((relation) => relationLabel(profile, relation)).join("; ")}.`, {
      intent: "relation",
      actions: [{ type: "show-view", view: "relations", label: "Open graph view" }],
      evidence: ["profile.relations"],
    });
  }

  if (/\b(timeline|history|evolution|evolve|journey|timeline|historia|evolucao|trajetoria)\b/.test(normalized)) {
    return answer(
      (profile.timeline || []).map((item) => `${item.phase} ${item.title}: ${item.summary}`).join(" → "),
      {
        intent: "timeline",
        actions: [{ type: "show-view", view: "timeline", label: "Open timeline" }],
        evidence: ["profile.timeline"],
      },
    );
  }

  if (/\b(who are you|what can you do|capabilities|ai twin|twin|quem e voce|o que voce faz|capacidades)\b/.test(normalized)) {
    return answer(
      `${profile.twin.name} is a public, graph-grounded interface over this engineering profile. Its configured capabilities are ${(profile.twin.capabilities || []).join(", ")}. V0.4 remains local-first and read-only; privileged tools and model credentials are intentionally outside the browser.`,
      { intent: "twin", evidence: ["profile.twin"], suggestions: getTwinSuggestions(profile) },
    );
  }

  if (/\b(projects?|systems?|repos?|portfolio|projetos?|sistemas?)\b/.test(normalized) && !primary) {
    return answer(
      `The public graph currently contains ${(profile.projects || []).length} systems: ${(profile.projects || []).map((project) => `${project.name} [${project.status || "tracked"}]`).join(", ")}.`,
      { intent: "projects", evidence: ["profile.projects"], suggestions: (profile.projects || []).slice(0, 4).map((project) => `Tell me about ${project.name}`) },
    );
  }

  if (primary) return describeProject(profile, primary);

  return answer(
    "I couldn't ground that question in the public profile yet. Ask about a project, project relationships, recent activity, the timeline, or what the Twin can do.",
    { intent: "fallback", suggestions: getTwinSuggestions(profile) },
  );
}

export const __test = { normalize, findProjects, connectedRelations, summarizeActivity };
