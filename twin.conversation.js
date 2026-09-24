import { PROFILE } from "./profile.config.js";
import { getTwinSuggestions } from "./twin.model.mjs";
import { resolveTwinTurn } from "./twin.gateway.mjs";

const CACHE_KEY = "az1nn:twin:activity:v1";
const MAX_HISTORY = PROFILE.conversation?.maxHistory || 12;
const ACTIVITY_TTL = PROFILE.conversation?.activityCacheTtlMs || 300000;

const state = {
  open: false,
  history: [
    {
      role: "twin",
      text: "Ask me about this engineering graph. I answer from public profile data and recent public GitHub activity.",
      evidence: ["public profile"],
    },
  ],
  activity: [],
  activityLoaded: false,
};

function projectById(id) {
  return PROFILE.projects.find((project) => project.id === id);
}

function readActivityCache() {
  try {
    const cached = JSON.parse(sessionStorage.getItem(CACHE_KEY) || "null");
    if (!cached || Date.now() - cached.timestamp > ACTIVITY_TTL || !Array.isArray(cached.events)) return null;
    return cached.events;
  } catch {
    return null;
  }
}

function writeActivityCache(events) {
  try {
    sessionStorage.setItem(CACHE_KEY, JSON.stringify({ timestamp: Date.now(), events }));
  } catch {
    // Session storage is an optimization only.
  }
}

async function loadActivity() {
  if (state.activityLoaded) return state.activity;
  const cached = readActivityCache();
  if (cached) {
    state.activity = cached;
    state.activityLoaded = true;
    return cached;
  }

  try {
    const response = await fetch(PROFILE.activity.endpoint, {
      headers: { Accept: "application/vnd.github+json" },
      cache: "no-store",
    });
    if (!response.ok) throw new Error(`GitHub activity returned ${response.status}`);
    const payload = await response.json();
    state.activity = Array.isArray(payload)
      ? payload.slice(0, 30).map((event) => ({
          id: event.id,
          type: event.type,
          repo: event.repo?.name || "",
          createdAt: event.created_at,
          commits: Number(event.payload?.size || event.payload?.commits?.length || 0),
        }))
      : [];
    writeActivityCache(state.activity);
  } catch (error) {
    console.warn("Twin activity context unavailable", error);
    state.activity = [];
  }
  state.activityLoaded = true;
  return state.activity;
}

function dispatchEscape() {
  window.dispatchEvent(new KeyboardEvent("keydown", { key: "Escape", bubbles: true }));
}

function resetProfilePanel() {
  dispatchEscape();
  dispatchEscape();
}

function runExistingTwinCommand(command) {
  resetProfilePanel();
  document.querySelector('[data-action="open-twin"]')?.click();
  const form = document.querySelector("[data-console-form]");
  const input = form?.elements?.command;
  if (!form || !input) return false;
  input.value = command;
  form.dispatchEvent(new Event("submit", { bubbles: true, cancelable: true }));
  return true;
}

function showProfileView(view) {
  resetProfilePanel();
  const selector = {
    activity: '[data-action="show-activity"]',
    relations: '[data-action="show-relations"]',
    timeline: '[data-action="show-timeline"]',
  }[view];
  const button = selector ? document.querySelector(selector) : null;
  if (!button) return false;
  button.click();
  return true;
}

function executeAction(action) {
  if (action.type === "open-repo") {
    const project = projectById(action.projectId);
    if (project?.url) window.open(project.url, "_blank", "noopener,noreferrer");
    return;
  }
  if (action.type === "focus-project") {
    runExistingTwinCommand(`focus ${action.projectId}`);
    return;
  }
  if (action.type === "show-view") showProfileView(action.view);
}

function createElement(tag, className, text) {
  const element = document.createElement(tag);
  if (className) element.className = className;
  if (text !== undefined) element.textContent = text;
  return element;
}

const launcher = createElement("button", "twin-launcher");
launcher.type = "button";
launcher.setAttribute("aria-expanded", "false");
launcher.setAttribute("aria-controls", "twin-chat");
launcher.innerHTML = '<span class="twin-launcher-dot"></span><span>ASK AI TWIN</span>';

document.body.appendChild(launcher);

const dialog = createElement("section", "twin-chat");
dialog.id = "twin-chat";
dialog.hidden = true;
dialog.setAttribute("aria-label", "AI Twin conversation");
dialog.innerHTML = `
  <div class="twin-chat-head">
    <div>
      <span class="twin-chat-kicker">AI TWIN / V0.4</span>
      <strong>Graph-grounded conversation</strong>
    </div>
    <div class="twin-chat-head-actions">
      <span class="twin-local-badge">LOCAL · READ ONLY</span>
      <button type="button" class="twin-close" aria-label="Close AI Twin">×</button>
    </div>
  </div>
  <div class="twin-chat-context">
    <span>PUBLIC GRAPH</span><i></i><span>GITHUB ACTIVITY</span><i></i><span>NO REMOTE LLM</span>
  </div>
  <div class="twin-chat-log" aria-live="polite"></div>
  <div class="twin-suggestions" aria-label="Suggested questions"></div>
  <form class="twin-chat-form" autocomplete="off">
    <textarea name="message" rows="1" maxlength="280" placeholder="Ask about projects, relations, activity…" aria-label="Message the AI Twin"></textarea>
    <button type="submit">ASK</button>
  </form>
`;
document.body.appendChild(dialog);

const log = dialog.querySelector(".twin-chat-log");
const suggestionsEl = dialog.querySelector(".twin-suggestions");
const form = dialog.querySelector(".twin-chat-form");
const textarea = form.elements.message;

function trimHistory() {
  if (state.history.length > MAX_HISTORY) state.history = state.history.slice(-MAX_HISTORY);
}

function renderEvidence(container, evidence = []) {
  if (!evidence.length) return;
  const row = createElement("div", "twin-evidence");
  evidence.slice(0, 4).forEach((item) => row.appendChild(createElement("span", "", item)));
  container.appendChild(row);
}

function renderActions(container, actions = []) {
  if (!actions.length) return;
  const row = createElement("div", "twin-message-actions");
  actions.forEach((action) => {
    const button = createElement("button", "", action.label || action.type);
    button.type = "button";
    button.addEventListener("click", () => executeAction(action));
    row.appendChild(button);
  });
  container.appendChild(row);
}

function renderHistory() {
  log.replaceChildren();
  state.history.forEach((message) => {
    const article = createElement("article", `twin-message ${message.role}`);
    article.appendChild(createElement("span", "twin-message-role", message.role === "user" ? "YOU" : "TWIN"));
    article.appendChild(createElement("p", "", message.text));
    if (message.role === "twin") {
      renderEvidence(article, message.evidence);
      renderActions(article, message.actions);
    }
    log.appendChild(article);
  });
  log.scrollTop = log.scrollHeight;
}

function renderSuggestions(items = getTwinSuggestions(PROFILE)) {
  suggestionsEl.replaceChildren();
  items.slice(0, 4).forEach((suggestion) => {
    const button = createElement("button", "", suggestion);
    button.type = "button";
    button.addEventListener("click", () => submitQuery(suggestion));
    suggestionsEl.appendChild(button);
  });
}

async function submitQuery(rawQuery) {
  const query = String(rawQuery || "").trim();
  if (!query) return;

  state.history.push({ role: "user", text: query });
  trimHistory();
  renderHistory();
  renderSuggestions([]);
  textarea.value = "";
  textarea.disabled = true;
  form.classList.add("is-thinking");

  const activity = await loadActivity();
  const response = await resolveTwinTurn(PROFILE, query, { activity });

  state.history.push({
    role: "twin",
    text: response.text,
    evidence: response.evidence || [],
    actions: response.actions || [],
  });
  trimHistory();
  renderHistory();
  renderSuggestions(response.suggestions?.length ? response.suggestions : getTwinSuggestions(PROFILE));
  textarea.disabled = false;
  form.classList.remove("is-thinking");
  textarea.focus();
}

function setOpen(open) {
  state.open = open;
  dialog.hidden = !open;
  launcher.setAttribute("aria-expanded", String(open));
  launcher.classList.toggle("is-open", open);
  if (open) {
    renderHistory();
    renderSuggestions();
    requestAnimationFrame(() => textarea.focus());
    loadActivity();
  }
}

launcher.addEventListener("click", () => setOpen(!state.open));
dialog.querySelector(".twin-close").addEventListener("click", () => setOpen(false));

form.addEventListener("submit", (event) => {
  event.preventDefault();
  submitQuery(textarea.value);
});

textarea.addEventListener("keydown", (event) => {
  if (event.key === "Enter" && !event.shiftKey) {
    event.preventDefault();
    form.requestSubmit();
  }
});

window.addEventListener(
  "keydown",
  (event) => {
    if (event.key === "Escape" && state.open) {
      event.preventDefault();
      event.stopImmediatePropagation();
      setOpen(false);
    }
  },
  true,
);

renderHistory();
renderSuggestions();
