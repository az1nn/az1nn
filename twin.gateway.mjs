import { resolveTwinQuery } from "./twin.model.mjs";

export const TWIN_GATEWAY_VERSION = "0.5";

const ALLOWED_REQUEST_KEYS = new Set(["version", "question", "profile", "activity", "client"]);
const ALLOWED_PROFILE_KEYS = new Set(["projects", "relations", "timeline"]);
const ALLOWED_CLIENT_KEYS = new Set(["profileVersion"]);
const ALLOWED_PROJECT_KEYS = new Set(["id", "name", "category", "status", "short", "url", "tags"]);
const ALLOWED_RELATION_KEYS = new Set(["source", "target", "label", "strength"]);
const ALLOWED_TIMELINE_KEYS = new Set(["phase", "title", "summary"]);
const ALLOWED_ACTIVITY_KEYS = new Set(["id", "type", "repo", "createdAt", "commits"]);
const ALLOWED_RESPONSE_KEYS = new Set(["answer", "grounding", "actions", "mode", "requestId"]);
const ALLOWED_GROUNDING_KINDS = new Set(["profile", "project", "relation", "timeline", "activity"]);
const ALLOWED_ACTION_TYPES = new Set(["focus-project", "open-repo", "show-view"]);
const ALLOWED_VIEWS = new Set(["activity", "relations", "timeline"]);
const MAX_QUESTION_LENGTH = 280;
const MAX_PROJECT_ITEMS = 50;
const MAX_RELATION_ITEMS = 100;
const MAX_TIMELINE_ITEMS = 50;
const MAX_ACTIVITY_ITEMS = 30;
const MAX_REQUEST_CHARS = 65536;
const MAX_GROUNDING_ITEMS = 12;
const MAX_ACTION_ITEMS = 4;

function isPlainObject(value) {
  return Boolean(value) && typeof value === "object" && !Array.isArray(value);
}

function hasOnlyKeys(value, allowed) {
  return Object.keys(value).every((key) => allowed.has(key));
}

function fail(error) {
  return { ok: false, error };
}

export function validateGatewayConfig(config) {
  if (!isPlainObject(config)) return fail("gateway config must be an object");
  if (config.version !== TWIN_GATEWAY_VERSION) return fail("unsupported gateway contract version");
  if (typeof config.enabled !== "boolean") return fail("gateway.enabled must be boolean");
  if (!Number.isInteger(config.timeoutMs) || config.timeoutMs < 500 || config.timeoutMs > 15000) {
    return fail("gateway.timeoutMs must be an integer between 500 and 15000");
  }
  if (typeof config.clientProfileVersion !== "string" || !config.clientProfileVersion.trim()) {
    return fail("gateway.clientProfileVersion is required");
  }

  if (!config.enabled) {
    if (config.endpoint !== null) return fail("disabled gateway must not define an endpoint in Phase A");
    return { ok: true };
  }

  if (typeof config.endpoint !== "string" || !config.endpoint.trim()) {
    return fail("enabled gateway requires an endpoint");
  }

  try {
    const endpoint = new URL(config.endpoint);
    if (endpoint.protocol !== "https:") return fail("gateway endpoint must use HTTPS");
  } catch {
    return fail("gateway endpoint must be a valid URL");
  }

  return { ok: true };
}

function sanitizeProject(project = {}) {
  return {
    id: String(project.id || ""),
    name: String(project.name || ""),
    category: String(project.category || ""),
    status: String(project.status || ""),
    short: String(project.short || ""),
    url: String(project.url || ""),
    tags: Array.isArray(project.tags) ? project.tags.slice(0, 12).map(String) : [],
  };
}

function sanitizeRelation(relation = {}) {
  return {
    source: String(relation.source || ""),
    target: String(relation.target || ""),
    label: String(relation.label || ""),
    strength: Number.isFinite(relation.strength) ? relation.strength : 0,
  };
}

function sanitizeTimeline(item = {}) {
  return {
    phase: String(item.phase || ""),
    title: String(item.title || ""),
    summary: String(item.summary || ""),
  };
}

function sanitizeActivity(event = {}) {
  return {
    id: String(event.id || ""),
    type: String(event.type || ""),
    repo: String(event.repo || ""),
    createdAt: String(event.createdAt || ""),
    commits: Number.isFinite(Number(event.commits)) ? Number(event.commits) : 0,
  };
}

export function validateGatewayRequest(payload) {
  if (!isPlainObject(payload)) return fail("request must be an object");
  if (!hasOnlyKeys(payload, ALLOWED_REQUEST_KEYS)) return fail("request contains unknown top-level fields");
  for (const key of ALLOWED_REQUEST_KEYS) {
    if (!(key in payload)) return fail("request is missing required field: " + key);
  }

  if (payload.version !== TWIN_GATEWAY_VERSION) return fail("request version must be 0.5");
  if (typeof payload.question !== "string" || !payload.question.trim() || payload.question.length > MAX_QUESTION_LENGTH) {
    return fail("request question is invalid");
  }

  if (!isPlainObject(payload.profile) || !hasOnlyKeys(payload.profile, ALLOWED_PROFILE_KEYS)) {
    return fail("request profile is invalid");
  }
  if (!Array.isArray(payload.profile.projects) || payload.profile.projects.length > MAX_PROJECT_ITEMS) {
    return fail("request projects exceed the contract limit");
  }
  if (!Array.isArray(payload.profile.relations) || payload.profile.relations.length > MAX_RELATION_ITEMS) {
    return fail("request relations exceed the contract limit");
  }
  if (!Array.isArray(payload.profile.timeline) || payload.profile.timeline.length > MAX_TIMELINE_ITEMS) {
    return fail("request timeline exceeds the contract limit");
  }

  for (const project of payload.profile.projects) {
    if (!isPlainObject(project) || !hasOnlyKeys(project, ALLOWED_PROJECT_KEYS)) return fail("request project is invalid");
    if (typeof project.id !== "string" || !project.id || typeof project.name !== "string" || !project.name) {
      return fail("request project identity is invalid");
    }
    if (![project.category, project.status, project.short, project.url].every((value) => typeof value === "string")) {
      return fail("request project fields are invalid");
    }
    if (!Array.isArray(project.tags) || project.tags.length > 12 || !project.tags.every((tag) => typeof tag === "string")) {
      return fail("request project tags are invalid");
    }
  }

  for (const relation of payload.profile.relations) {
    if (!isPlainObject(relation) || !hasOnlyKeys(relation, ALLOWED_RELATION_KEYS)) return fail("request relation is invalid");
    if (![relation.source, relation.target, relation.label].every((value) => typeof value === "string" && value)) {
      return fail("request relation fields are invalid");
    }
    if (!Number.isFinite(relation.strength) || relation.strength < 0 || relation.strength > 1) {
      return fail("request relation strength is invalid");
    }
  }

  for (const item of payload.profile.timeline) {
    if (!isPlainObject(item) || !hasOnlyKeys(item, ALLOWED_TIMELINE_KEYS)) return fail("request timeline item is invalid");
    if (![item.phase, item.title, item.summary].every((value) => typeof value === "string" && value)) {
      return fail("request timeline fields are invalid");
    }
  }

  if (!Array.isArray(payload.activity) || payload.activity.length > MAX_ACTIVITY_ITEMS) {
    return fail("request activity exceeds the contract limit");
  }
  for (const event of payload.activity) {
    if (!isPlainObject(event) || !hasOnlyKeys(event, ALLOWED_ACTIVITY_KEYS)) return fail("request activity item is invalid");
    if (![event.id, event.type, event.repo, event.createdAt].every((value) => typeof value === "string")) {
      return fail("request activity fields are invalid");
    }
    if (!Number.isFinite(event.commits) || event.commits < 0) return fail("request activity commits are invalid");
  }

  if (!isPlainObject(payload.client) || !hasOnlyKeys(payload.client, ALLOWED_CLIENT_KEYS)) {
    return fail("request client is invalid");
  }
  if (typeof payload.client.profileVersion !== "string" || !payload.client.profileVersion.trim()) {
    return fail("request client profileVersion is invalid");
  }

  if (JSON.stringify(payload).length > MAX_REQUEST_CHARS) return fail("request exceeds the contract size limit");
  return { ok: true };
}

export function buildGatewayRequest(profile, rawQuestion, activity = []) {
  const question = String(rawQuestion || "").trim();
  if (!question) throw new TypeError("question is required");
  if (question.length > MAX_QUESTION_LENGTH) throw new TypeError("question exceeds the client limit");

  const config = profile?.conversation?.gateway;
  const configValidation = validateGatewayConfig(config);
  if (!configValidation.ok) throw new TypeError(configValidation.error);

  const payload = {
    version: TWIN_GATEWAY_VERSION,
    question,
    profile: {
      projects: (profile.projects || []).slice(0, MAX_PROJECT_ITEMS).map(sanitizeProject),
      relations: (profile.relations || []).slice(0, MAX_RELATION_ITEMS).map(sanitizeRelation),
      timeline: (profile.timeline || []).slice(0, MAX_TIMELINE_ITEMS).map(sanitizeTimeline),
    },
    activity: (Array.isArray(activity) ? activity : []).slice(0, MAX_ACTIVITY_ITEMS).map(sanitizeActivity),
    client: {
      profileVersion: config.clientProfileVersion,
    },
  };

  const requestValidation = validateGatewayRequest(payload);
  if (!requestValidation.ok) throw new TypeError(requestValidation.error);
  return payload;
}

function normalizeAction(action, profile) {
  if (!isPlainObject(action)) return fail("action must be an object");
  const allowedActionKeys = new Set(["type", "target", "label"]);
  if (!hasOnlyKeys(action, allowedActionKeys)) return fail("action contains unknown fields");
  if (!ALLOWED_ACTION_TYPES.has(action.type)) return fail("unsupported action type");
  if (typeof action.target !== "string" || !action.target.trim()) return fail("action target is required");
  if (action.label !== undefined && (typeof action.label !== "string" || action.label.length > 80)) {
    return fail("action label is invalid");
  }

  if (action.type === "show-view") {
    if (!ALLOWED_VIEWS.has(action.target)) return fail("unsupported view target");
    return {
      ok: true,
      value: {
        type: action.type,
        view: action.target,
        ...(action.label ? { label: action.label } : {}),
      },
    };
  }

  const project = (profile.projects || []).find((item) => item.id === action.target);
  if (!project) return fail("action project target is not in the public profile graph");

  return {
    ok: true,
    value: {
      type: action.type,
      projectId: action.target,
      ...(action.label ? { label: action.label } : {}),
    },
  };
}

export function validateGatewayResponse(payload, profile) {
  if (!isPlainObject(payload)) return fail("response must be an object");
  if (!hasOnlyKeys(payload, ALLOWED_RESPONSE_KEYS)) return fail("response contains unknown top-level fields");
  for (const key of ALLOWED_RESPONSE_KEYS) {
    if (!(key in payload)) return fail("response is missing required field: " + key);
  }

  if (typeof payload.answer !== "string" || !payload.answer.trim() || payload.answer.length > 4000) {
    return fail("response answer is invalid");
  }
  if (payload.mode !== "remote-grounded") return fail("response mode must be remote-grounded");
  if (typeof payload.requestId !== "string" || !payload.requestId.trim() || payload.requestId.length > 128) {
    return fail("response requestId is invalid");
  }
  if (!Array.isArray(payload.grounding) || payload.grounding.length < 1 || payload.grounding.length > MAX_GROUNDING_ITEMS) {
    return fail("response grounding must contain between 1 and 12 items");
  }
  if (!Array.isArray(payload.actions) || payload.actions.length > MAX_ACTION_ITEMS) {
    return fail("response actions must be an array with at most 4 items");
  }

  const grounding = [];
  for (const item of payload.grounding) {
    if (!isPlainObject(item) || !hasOnlyKeys(item, new Set(["kind", "id"]))) {
      return fail("grounding item is invalid");
    }
    if (!ALLOWED_GROUNDING_KINDS.has(item.kind)) return fail("unsupported grounding kind");
    if (typeof item.id !== "string" || !item.id.trim() || item.id.length > 160) {
      return fail("grounding id is invalid");
    }
    grounding.push({ kind: item.kind, id: item.id });
  }

  const actions = [];
  for (const action of payload.actions) {
    const normalized = normalizeAction(action, profile);
    if (!normalized.ok) return normalized;
    actions.push(normalized.value);
  }

  return {
    ok: true,
    value: {
      answer: payload.answer.trim(),
      grounding,
      actions,
      mode: payload.mode,
      requestId: payload.requestId,
    },
  };
}

export async function requestRemoteTwin(profile, question, { activity = [], fetchImpl = globalThis.fetch } = {}) {
  const config = profile?.conversation?.gateway;
  const configValidation = validateGatewayConfig(config);
  if (!configValidation.ok) return { ok: false, reason: "invalid-config" };
  if (!config.enabled) return { ok: false, reason: "disabled" };
  if (typeof fetchImpl !== "function") return { ok: false, reason: "fetch-unavailable" };

  let request;
  try {
    request = buildGatewayRequest(profile, question, activity);
  } catch {
    return { ok: false, reason: "invalid-request" };
  }

  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), config.timeoutMs);

  try {
    const response = await fetchImpl(config.endpoint, {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify(request),
      cache: "no-store",
      credentials: "omit",
      referrerPolicy: "no-referrer",
      signal: controller.signal,
    });

    if (!response?.ok) return { ok: false, reason: "http-error" };

    let payload;
    try {
      payload = await response.json();
    } catch {
      return { ok: false, reason: "malformed-json" };
    }

    const validated = validateGatewayResponse(payload, profile);
    if (!validated.ok) return { ok: false, reason: "invalid-response" };
    return { ok: true, response: validated.value };
  } catch (error) {
    return { ok: false, reason: error?.name === "AbortError" ? "timeout" : "network-error" };
  } finally {
    clearTimeout(timeout);
  }
}

export async function resolveTwinTurn(profile, question, options = {}) {
  const activity = Array.isArray(options.activity) ? options.activity : [];
  const local = resolveTwinQuery(profile, question, { activity });
  const remote = await requestRemoteTwin(profile, question, options);

  if (!remote.ok) {
    return {
      ...local,
      mode: "local-grounded",
      remoteFallbackReason: remote.reason,
    };
  }

  return {
    text: remote.response.answer,
    intent: "remote",
    actions: remote.response.actions,
    evidence: remote.response.grounding.map((item) => item.kind + ":" + item.id),
    suggestions: [],
    mode: remote.response.mode,
    requestId: remote.response.requestId,
  };
}
