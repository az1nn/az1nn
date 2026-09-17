import * as THREE from "three";
import { OrbitControls } from "three/addons/controls/OrbitControls.js";
import { PROFILE } from "./profile.config.js";

const canvas = document.querySelector("#scene");
const panel = document.querySelector("#project-panel");
const activityStatusEl = document.querySelector("#activity-status");
const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

const renderer = new THREE.WebGLRenderer({
  canvas,
  antialias: true,
  alpha: true,
  powerPreference: "high-performance",
});
renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
renderer.setSize(window.innerWidth, window.innerHeight, false);
renderer.outputColorSpace = THREE.SRGBColorSpace;
renderer.toneMapping = THREE.ACESFilmicToneMapping;
renderer.toneMappingExposure = 1.05;

const scene = new THREE.Scene();
scene.fog = new THREE.FogExp2(0x070a10, 0.052);

const camera = new THREE.PerspectiveCamera(46, window.innerWidth / window.innerHeight, 0.1, 100);
const controls = new OrbitControls(camera, renderer.domElement);
controls.enableDamping = true;
controls.dampingFactor = 0.055;
controls.enablePan = false;
controls.minDistance = 5.8;
controls.maxDistance = 14;
controls.rotateSpeed = 0.48;
controls.zoomSpeed = 0.72;

scene.add(new THREE.AmbientLight(0x9aa6bf, 1.3));

const keyLight = new THREE.DirectionalLight(0xd8ccff, 4.2);
keyLight.position.set(5, 7, 8);
scene.add(keyLight);

const purpleLight = new THREE.PointLight(0x8b5cf6, 22, 22, 1.7);
purpleLight.position.set(1.8, 0.8, 3.4);
scene.add(purpleLight);

const blueLight = new THREE.PointLight(0x38bdf8, 7, 18, 2);
blueLight.position.set(-5, -2, 2);
scene.add(blueLight);

const constellation = new THREE.Group();
scene.add(constellation);

function createStarField(count = 900) {
  const geometry = new THREE.BufferGeometry();
  const positions = new Float32Array(count * 3);

  for (let i = 0; i < count; i += 1) {
    const radius = 11 + Math.random() * 22;
    const theta = Math.random() * Math.PI * 2;
    const phi = Math.acos(2 * Math.random() - 1);
    positions[i * 3] = radius * Math.sin(phi) * Math.cos(theta);
    positions[i * 3 + 1] = radius * Math.cos(phi);
    positions[i * 3 + 2] = radius * Math.sin(phi) * Math.sin(theta);
  }

  geometry.setAttribute("position", new THREE.BufferAttribute(positions, 3));
  const material = new THREE.PointsMaterial({
    color: 0xa78bfa,
    size: 0.035,
    transparent: true,
    opacity: 0.6,
    depthWrite: false,
    sizeAttenuation: true,
  });

  const points = new THREE.Points(geometry, material);
  scene.add(points);
  return points;
}

const stars = createStarField();

function makeLabel(text, accent = "#c4b5fd") {
  const labelCanvas = document.createElement("canvas");
  const ctx = labelCanvas.getContext("2d");
  const ratio = 2;
  labelCanvas.width = 620 * ratio;
  labelCanvas.height = 104 * ratio;
  ctx.scale(ratio, ratio);
  ctx.clearRect(0, 0, 620, 104);
  ctx.font = "700 25px Inter, system-ui, sans-serif";

  const width = Math.min(570, ctx.measureText(text).width + 46);
  const left = (620 - width) / 2;
  ctx.fillStyle = "rgba(8, 12, 19, 0.82)";
  ctx.strokeStyle = accent;
  ctx.globalAlpha = 0.55;
  ctx.lineWidth = 1.2;
  ctx.beginPath();
  ctx.roundRect(left, 20, width, 56, 28);
  ctx.fill();
  ctx.stroke();
  ctx.globalAlpha = 1;
  ctx.fillStyle = "#eef2ff";
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  ctx.fillText(text, 310, 48);

  const texture = new THREE.CanvasTexture(labelCanvas);
  texture.colorSpace = THREE.SRGBColorSpace;
  texture.minFilter = THREE.LinearFilter;

  const sprite = new THREE.Sprite(
    new THREE.SpriteMaterial({ map: texture, transparent: true, depthWrite: false }),
  );
  sprite.scale.set(3.65, 0.62, 1);
  return sprite;
}

const coreGroup = new THREE.Group();
constellation.add(coreGroup);

const core = new THREE.Mesh(
  new THREE.IcosahedronGeometry(1.08, 4),
  new THREE.MeshPhysicalMaterial({
    color: 0x8b5cf6,
    emissive: 0x3b0764,
    emissiveIntensity: 0.58,
    metalness: 0.72,
    roughness: 0.16,
    clearcoat: 1,
    clearcoatRoughness: 0.12,
  }),
);
coreGroup.add(core);

const wireframe = new THREE.Mesh(
  new THREE.IcosahedronGeometry(1.22, 2),
  new THREE.MeshBasicMaterial({
    color: 0xc4b5fd,
    wireframe: true,
    transparent: true,
    opacity: 0.18,
  }),
);
coreGroup.add(wireframe);

for (const [radius, opacity, tube] of [
  [1.52, 0.34, 0.012],
  [1.72, 0.2, 0.009],
  [2.02, 0.12, 0.007],
]) {
  const ring = new THREE.Mesh(
    new THREE.TorusGeometry(radius, tube, 12, 180),
    new THREE.MeshBasicMaterial({ color: 0xa78bfa, transparent: true, opacity }),
  );
  ring.rotation.set(Math.PI * 0.55, Math.PI * 0.18, 0);
  coreGroup.add(ring);
}

const halo = new THREE.Mesh(
  new THREE.SphereGeometry(1.42, 42, 42),
  new THREE.MeshBasicMaterial({
    color: 0x7c3aed,
    transparent: true,
    opacity: 0.055,
    side: THREE.BackSide,
    blending: THREE.AdditiveBlending,
  }),
);
coreGroup.add(halo);

const coreLabel = makeLabel("AZ1NN", "#a78bfa");
coreLabel.position.set(0, -1.85, 0);
coreGroup.add(coreLabel);

const interactiveTargets = [];
const records = [];
const recordsById = new Map();
const relationRecords = [];
const activityNodes = [];
const connectorMaterial = new THREE.LineBasicMaterial({
  color: 0x8b5cf6,
  transparent: true,
  opacity: 0.24,
});

function attachInteraction(object, record) {
  object.userData.record = record;
  interactiveTargets.push(object);
}

function createConnector(position, color = 0x8b5cf6, opacity = 0.24) {
  const geometry = new THREE.BufferGeometry().setFromPoints([
    new THREE.Vector3(0, 0, 0),
    position,
  ]);
  const material = connectorMaterial.clone();
  material.color.setHex(color);
  material.opacity = opacity;
  const line = new THREE.Line(geometry, material);
  constellation.add(line);
  return line;
}

function createProjectRecord(project, index) {
  const position = new THREE.Vector3(...project.position);
  const group = new THREE.Group();
  group.position.copy(position);
  group.userData.basePosition = position.clone();
  group.userData.phase = index * 1.37;
  constellation.add(group);

  const mesh = new THREE.Mesh(
    new THREE.SphereGeometry(project.scale, 36, 36),
    new THREE.MeshPhysicalMaterial({
      color: index % 2 === 0 ? 0x7c3aed : 0x5b21b6,
      emissive: 0x2e1065,
      emissiveIntensity: 0.32,
      metalness: 0.64,
      roughness: 0.22,
      clearcoat: 0.9,
      clearcoatRoughness: 0.14,
      transparent: true,
      opacity: 1,
    }),
  );
  group.add(mesh);

  const orbit = new THREE.Mesh(
    new THREE.TorusGeometry(project.scale * 1.48, 0.006, 8, 80),
    new THREE.MeshBasicMaterial({ color: 0xc4b5fd, transparent: true, opacity: 0.34 }),
  );
  orbit.rotation.x = Math.PI / 2;
  group.add(orbit);

  const label = makeLabel(project.name);
  label.position.set(0, -(project.scale + 0.58), 0);
  group.add(label);

  const hitTarget = new THREE.Mesh(
    new THREE.SphereGeometry(Math.max(project.scale * 1.8, 0.74), 18, 18),
    new THREE.MeshBasicMaterial({
      transparent: true,
      opacity: 0,
      depthWrite: false,
      colorWrite: false,
    }),
  );
  group.add(hitTarget);

  const line = createConnector(position, 0x8b5cf6, 0.2 + index * 0.012);
  const record = {
    entity: project,
    group,
    mesh,
    orbit,
    label,
    line,
    baseMeshOpacity: 1,
    baseLineOpacity: line.material.opacity,
  };

  attachInteraction(mesh, record);
  attachInteraction(hitTarget, record);
  attachInteraction(label, record);
  records.push(record);
  recordsById.set(project.id, record);
  return record;
}

PROFILE.projects.forEach(createProjectRecord);

const twinPosition = new THREE.Vector3(...PROFILE.twin.position);
const twinGroup = new THREE.Group();
twinGroup.position.copy(twinPosition);
twinGroup.userData.basePosition = twinPosition.clone();
twinGroup.userData.phase = 9.8;
constellation.add(twinGroup);

const twinCore = new THREE.Mesh(
  new THREE.IcosahedronGeometry(0.76, 4),
  new THREE.MeshPhysicalMaterial({
    color: 0x38bdf8,
    emissive: 0x075985,
    emissiveIntensity: 1.15,
    metalness: 0.58,
    roughness: 0.12,
    clearcoat: 1,
    transparent: true,
    opacity: 0.76,
  }),
);
twinGroup.add(twinCore);

const twinWireframe = new THREE.Mesh(
  new THREE.IcosahedronGeometry(0.9, 2),
  new THREE.MeshBasicMaterial({
    color: 0x7dd3fc,
    wireframe: true,
    transparent: true,
    opacity: 0.72,
    blending: THREE.AdditiveBlending,
  }),
);
twinGroup.add(twinWireframe);

const twinAura = new THREE.Mesh(
  new THREE.SphereGeometry(1.08, 32, 32),
  new THREE.MeshBasicMaterial({
    color: 0x38bdf8,
    transparent: true,
    opacity: 0.08,
    side: THREE.BackSide,
    blending: THREE.AdditiveBlending,
  }),
);
twinGroup.add(twinAura);

const twinRingA = new THREE.Mesh(
  new THREE.TorusGeometry(1.02, 0.012, 10, 120),
  new THREE.MeshBasicMaterial({
    color: 0x7dd3fc,
    transparent: true,
    opacity: 0.62,
    blending: THREE.AdditiveBlending,
  }),
);
twinRingA.rotation.x = Math.PI / 2.25;
twinGroup.add(twinRingA);

const twinRingB = twinRingA.clone();
twinRingB.scale.setScalar(1.14);
twinRingB.rotation.set(Math.PI / 2, 0.55, 0.22);
twinRingB.material = twinRingA.material.clone();
twinRingB.material.opacity = 0.34;
twinGroup.add(twinRingB);

const twinLabel = makeLabel("AI TWIN", "#38bdf8");
twinLabel.position.set(0, -1.42, 0);
twinGroup.add(twinLabel);

const twinHitTarget = new THREE.Mesh(
  new THREE.SphereGeometry(1.2, 20, 20),
  new THREE.MeshBasicMaterial({
    transparent: true,
    opacity: 0,
    depthWrite: false,
    colorWrite: false,
  }),
);
twinGroup.add(twinHitTarget);

const twinLight = new THREE.PointLight(0x38bdf8, 7, 7, 2);
twinLight.position.set(0, 0, 0.7);
twinGroup.add(twinLight);

const twinLine = createConnector(twinPosition, 0x38bdf8, 0.38);
const twinRecord = {
  entity: PROFILE.twin,
  group: twinGroup,
  mesh: twinCore,
  orbit: twinRingA,
  label: twinLabel,
  line: twinLine,
  baseMeshOpacity: 0.76,
  baseLineOpacity: 0.38,
};
attachInteraction(twinCore, twinRecord);
attachInteraction(twinHitTarget, twinRecord);
attachInteraction(twinLabel, twinRecord);
records.push(twinRecord);
recordsById.set(PROFILE.twin.id, twinRecord);

function createRelationRecord(relation, index) {
  const source = recordsById.get(relation.source);
  const target = recordsById.get(relation.target);
  if (!source || !target) return null;

  const positions = new Float32Array(6);
  const geometry = new THREE.BufferGeometry();
  geometry.setAttribute("position", new THREE.BufferAttribute(positions, 3));

  const line = new THREE.Line(
    geometry,
    new THREE.LineBasicMaterial({
      color: index % 2 === 0 ? 0x22d3ee : 0xa78bfa,
      transparent: true,
      opacity: 0.12 + relation.strength * 0.18,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
    }),
  );
  line.frustumCulled = false;
  constellation.add(line);

  const particle = new THREE.Mesh(
    new THREE.SphereGeometry(0.045, 10, 10),
    new THREE.MeshBasicMaterial({
      color: index % 2 === 0 ? 0x67e8f9 : 0xc4b5fd,
      transparent: true,
      opacity: 0.5,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
    }),
  );
  constellation.add(particle);

  const record = {
    relation,
    source,
    target,
    line,
    particle,
    positions,
    phase: index * 0.19,
    baseOpacity: line.material.opacity,
  };
  relationRecords.push(record);
  return record;
}

(PROFILE.relations || []).forEach(createRelationRecord);

const activityGroup = new THREE.Group();
constellation.add(activityGroup);
let activityEvents = [];
let activityStatus = "loading";

function activityColor(type) {
  if (type === "PushEvent") return 0xa78bfa;
  if (type === "PullRequestEvent" || type === "PullRequestReviewEvent") return 0x22d3ee;
  if (type === "CreateEvent" || type === "ReleaseEvent") return 0xd946ef;
  if (type === "IssuesEvent" || type === "IssueCommentEvent") return 0xf59e0b;
  return 0x64748b;
}

function activityLabel(type) {
  const labels = {
    PushEvent: "Push",
    PullRequestEvent: "Pull request",
    PullRequestReviewEvent: "Review",
    CreateEvent: "Create",
    ReleaseEvent: "Release",
    IssuesEvent: "Issue",
    IssueCommentEvent: "Discussion",
    WatchEvent: "Star",
    ForkEvent: "Fork",
  };
  return labels[type] || type.replace(/Event$/, "");
}

function normalizeActivityEvent(event) {
  return {
    id: event.id,
    type: event.type,
    label: activityLabel(event.type),
    repo: event.repo?.name?.replace(`${PROFILE.owner.handle}/`, "") || "github",
    createdAt: event.created_at,
    commits: Number(event.payload?.size || event.payload?.commits?.length || 0),
  };
}

function updateActivityStatus() {
  if (!activityStatusEl) return;
  activityStatusEl.classList.remove("is-loading", "is-online", "is-offline");

  if (activityStatus === "online") {
    activityStatusEl.classList.add("is-online");
    activityStatusEl.textContent = `ACTIVITY / ${activityEvents.length}`;
  } else if (activityStatus === "offline") {
    activityStatusEl.classList.add("is-offline");
    activityStatusEl.textContent = "ACTIVITY / OFFLINE";
  } else {
    activityStatusEl.classList.add("is-loading");
    activityStatusEl.textContent = "ACTIVITY / SYNC";
  }
}

function clearActivityNodes() {
  while (activityGroup.children.length) {
    const child = activityGroup.children.pop();
    child.geometry?.dispose?.();
    child.material?.dispose?.();
  }
  activityNodes.length = 0;
}

function renderActivityNodes(events) {
  clearActivityNodes();
  const count = Math.min(events.length, PROFILE.activity.maxNodes || 18);

  events.slice(0, count).forEach((event, index) => {
    const ring = index % 2;
    const radius = ring === 0 ? 2.75 : 3.35;
    const angle = (index / Math.max(count, 1)) * Math.PI * 2 + ring * 0.32;
    const position = new THREE.Vector3(
      Math.cos(angle) * radius,
      Math.sin(angle) * radius * 0.52,
      -1.05 - ring * 0.42 + Math.sin(angle * 2) * 0.25,
    );

    const mesh = new THREE.Mesh(
      new THREE.SphereGeometry(event.type === "PushEvent" ? 0.07 : 0.052, 10, 10),
      new THREE.MeshBasicMaterial({
        color: activityColor(event.type),
        transparent: true,
        opacity: 0.62,
        blending: THREE.AdditiveBlending,
        depthWrite: false,
      }),
    );
    mesh.position.copy(position);
    activityGroup.add(mesh);
    activityNodes.push({ mesh, event, base: position, phase: index * 0.63 });
  });
}

async function loadActivity() {
  updateActivityStatus();
  try {
    const response = await fetch(PROFILE.activity.endpoint, {
      headers: { Accept: "application/vnd.github+json" },
      cache: "no-store",
    });
    if (!response.ok) throw new Error(`GitHub activity returned ${response.status}`);
    const payload = await response.json();
    activityEvents = Array.isArray(payload) ? payload.map(normalizeActivityEvent) : [];
    activityStatus = "online";
    renderActivityNodes(activityEvents);
  } catch (error) {
    console.warn("Profile activity unavailable", error);
    activityEvents = [];
    activityStatus = "offline";
    clearActivityNodes();
  }
  updateActivityStatus();
  if (!focusedRecord && panelView === "default") renderPanel();
}

let twinState = "thinking";
let panelView = "default";
let consoleTranscript = [
  { kind: "system", text: "Twin console online. Type help to inspect the local graph." },
];

const raycaster = new THREE.Raycaster();
const pointer = new THREE.Vector2(99, 99);
let pointerDown = null;
let hoveredRecord = null;
let focusedRecord = null;
let cameraTransition = false;
const desiredCamera = new THREE.Vector3();
const desiredTarget = new THREE.Vector3();

function escapeHtml(value) {
  return String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;");
}

function formatActivityTime(value) {
  if (!value) return "recent";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "recent";
  return new Intl.DateTimeFormat(undefined, {
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  }).format(date);
}

function connectedRelations(id) {
  return (PROFILE.relations || []).filter((relation) => relation.source === id || relation.target === id);
}

function projectPanelHtml(project, isFocused) {
  const tags = (project.tags || [])
    .map((tag) => `<span class="panel-tag">${escapeHtml(tag)}</span>`)
    .join("");
  const connections = connectedRelations(project.id);

  return `
    <div class="panel-topline">
      <span class="panel-kicker">${escapeHtml(project.category || "PROJECT")} · ${escapeHtml(project.status || "ACTIVE")}</span>
      <span class="panel-mode">${isFocused ? "PROJECT FOCUS" : "GRAPH NODE"}</span>
    </div>
    <h2>${escapeHtml(project.name)}</h2>
    <p>${escapeHtml(project.short)}</p>
    <div class="panel-tags">${tags}</div>
    <div class="panel-metric-row">
      <span>${connections.length} graph connection${connections.length === 1 ? "" : "s"}</span>
      <span>${escapeHtml(project.status || "Active")}</span>
    </div>
    ${
      isFocused
        ? `<div class="panel-actions">
            <button type="button" class="panel-button primary" data-action="open-repo">Open repository ↗</button>
            <button type="button" class="panel-button" data-action="show-relations">Connections</button>
            <button type="button" class="panel-button" data-action="back">Back</button>
          </div>`
        : `<span class="panel-action-hint">click the node to enter focus</span>`
    }
  `;
}

function consoleHtml() {
  const lines = consoleTranscript
    .slice(-8)
    .map(
      (entry) => `
        <div class="console-line ${escapeHtml(entry.kind)}">
          <span>${entry.kind === "user" ? ">" : entry.kind === "error" ? "!" : "·"}</span>
          <p>${escapeHtml(entry.text)}</p>
        </div>`,
    )
    .join("");

  return `
    <div class="twin-console" aria-label="AI Twin local console">
      <div class="console-head">
        <span>LOCAL GRAPH CONSOLE</span>
        <span>NO REMOTE LLM</span>
      </div>
      <div class="console-log" aria-live="polite">${lines}</div>
      <form class="console-form" data-console-form autocomplete="off">
        <span class="console-prompt">›</span>
        <input class="console-input" name="command" aria-label="Twin command" placeholder="help · projects · focus openband" />
        <button class="console-submit" type="submit">RUN</button>
      </form>
    </div>
  `;
}

function twinPanelHtml() {
  const state = PROFILE.twin.states[twinState];
  const capabilities = PROFILE.twin.capabilities
    .map((item) => `<span class="panel-tag twin-tag">${escapeHtml(item)}</span>`)
    .join("");
  const states = Object.entries(PROFILE.twin.states)
    .map(
      ([key, value]) => `
        <button type="button" class="state-button ${key === twinState ? "is-selected" : ""}" data-twin-state="${key}">
          ${escapeHtml(value.label)}
        </button>`,
    )
    .join("");

  return `
    <div class="panel-topline">
      <span class="panel-kicker">AI TWIN · ${escapeHtml(state.label)}</span>
      <span class="panel-mode twin-mode">V0.3 CONSOLE</span>
    </div>
    <h2>${escapeHtml(PROFILE.twin.name)}</h2>
    <p>${escapeHtml(state.description)}</p>
    <div class="panel-tags">${capabilities}</div>
    <div class="twin-state-picker" aria-label="AI Twin state">${states}</div>
    ${consoleHtml()}
    <div class="panel-actions">
      <button type="button" class="panel-button" data-action="back">Back to constellation</button>
    </div>
  `;
}

function activitySummaryText() {
  if (activityStatus === "loading") return "Synchronizing recent public GitHub events…";
  if (activityStatus === "offline") return "Live public activity is temporarily unavailable. The project graph remains fully interactive.";
  if (!activityEvents.length) return "No recent public events were returned by GitHub.";

  const pushes = activityEvents.filter((event) => event.type === "PushEvent");
  const commitSignals = pushes.reduce((sum, event) => sum + event.commits, 0);
  const repos = new Set(activityEvents.map((event) => event.repo));
  return `${activityEvents.length} recent public events across ${repos.size} repositories${commitSignals ? `, including ${commitSignals} commit signals in push events` : ""}.`;
}

function defaultPanelHtml() {
  return `
    <div class="panel-topline">
      <span class="panel-kicker">LIVING SYSTEM MAP</span>
      <span class="panel-mode">PROFILE V0.3</span>
    </div>
    <h2>Engineering constellation</h2>
    <p>Projects are connected by explicit engineering relationships, with a live layer derived from recent public GitHub activity.</p>
    <div class="panel-metric-row">
      <span>${PROFILE.projects.length} systems</span>
      <span>${(PROFILE.relations || []).length} relations</span>
      <span>${activityStatus === "online" ? `${activityEvents.length} live events` : activityStatus}</span>
    </div>
    <div class="panel-dashboard-actions">
      <button type="button" class="panel-button primary" data-action="open-twin">Open AI Twin</button>
      <button type="button" class="panel-button" data-action="show-activity">Activity</button>
      <button type="button" class="panel-button" data-action="show-relations">Graph</button>
      <button type="button" class="panel-button" data-action="show-timeline">Timeline</button>
    </div>
    <span class="panel-action-hint">select a node or explore the system views</span>
  `;
}

function activityPanelHtml() {
  const items = activityEvents
    .slice(0, 7)
    .map(
      (event) => `
        <li class="activity-item">
          <span class="activity-dot type-${escapeHtml(event.type.toLowerCase())}"></span>
          <div>
            <strong>${escapeHtml(event.label)} · ${escapeHtml(event.repo)}</strong>
            <small>${escapeHtml(formatActivityTime(event.createdAt))}${event.commits ? ` · ${event.commits} commit${event.commits === 1 ? "" : "s"}` : ""}</small>
          </div>
        </li>`,
    )
    .join("");

  return `
    <div class="panel-topline">
      <span class="panel-kicker">${escapeHtml(PROFILE.activity.label)}</span>
      <span class="panel-mode ${activityStatus === "online" ? "live-mode" : ""}">${activityStatus.toUpperCase()}</span>
    </div>
    <h2>Activity layer</h2>
    <p>${escapeHtml(activitySummaryText())}</p>
    ${items ? `<ul class="activity-list">${items}</ul>` : ""}
    <div class="panel-actions">
      <button type="button" class="panel-button" data-action="refresh-activity">Refresh</button>
      <button type="button" class="panel-button" data-action="back-panel">System map</button>
    </div>
  `;
}

function relationsPanelHtml() {
  const focusId = focusedRecord?.entity?.kind === "project" ? focusedRecord.entity.id : null;
  const relations = focusId ? connectedRelations(focusId) : PROFILE.relations || [];
  const items = relations
    .map((relation) => {
      const source = recordsById.get(relation.source)?.entity;
      const target = recordsById.get(relation.target)?.entity;
      return `
        <li class="relation-item">
          <div class="relation-path">
            <button type="button" data-focus-id="${escapeHtml(relation.source)}">${escapeHtml(source?.name || relation.source)}</button>
            <span>→</span>
            <button type="button" data-focus-id="${escapeHtml(relation.target)}">${escapeHtml(target?.name || relation.target)}</button>
          </div>
          <small>${escapeHtml(relation.label)}</small>
        </li>`;
    })
    .join("");

  return `
    <div class="panel-topline">
      <span class="panel-kicker">ENGINEERING GRAPH</span>
      <span class="panel-mode">${focusId ? "CONNECTED NODE" : `${relations.length} EDGES`}</span>
    </div>
    <h2>${focusId ? `${escapeHtml(focusedRecord.entity.name)} connections` : "System relations"}</h2>
    <p>These links are explicit relationships between projects, not visual decoration.</p>
    <ul class="relation-list">${items || "<li>No configured relations.</li>"}</ul>
    <div class="panel-actions">
      ${focusId ? `<button type="button" class="panel-button" data-action="back-to-record">Project focus</button>` : ""}
      <button type="button" class="panel-button" data-action="back-panel">System map</button>
    </div>
  `;
}

function timelinePanelHtml() {
  const items = (PROFILE.timeline || [])
    .map(
      (item) => `
        <li class="timeline-item">
          <span class="timeline-phase">${escapeHtml(item.phase)}</span>
          <div>
            <strong>${escapeHtml(item.title)}</strong>
            <p>${escapeHtml(item.summary)}</p>
          </div>
        </li>`,
    )
    .join("");

  return `
    <div class="panel-topline">
      <span class="panel-kicker">ENGINEERING TIMELINE</span>
      <span class="panel-mode">SYSTEM EVOLUTION</span>
    </div>
    <h2>Build → graph</h2>
    <p>A compact technical narrative of how the profile moves from shipping software toward connected, AI-assisted engineering systems.</p>
    <ol class="timeline-list">${items}</ol>
    <div class="panel-actions">
      <button type="button" class="panel-button" data-action="back-panel">System map</button>
    </div>
  `;
}

function renderPanel(record = focusedRecord || (panelView === "default" ? hoveredRecord : null)) {
  panel.classList.remove("is-active", "is-twin", "is-dashboard", "is-interactive", "is-view");

  if (focusedRecord) {
    panel.classList.add("is-active", "is-interactive");
    panel.classList.toggle("is-twin", focusedRecord.entity.kind === "twin");
    panel.innerHTML = focusedRecord.entity.kind === "twin" ? twinPanelHtml() : projectPanelHtml(focusedRecord.entity, true);
    return;
  }

  if (panelView === "activity") {
    panel.classList.add("is-active", "is-interactive", "is-view");
    panel.innerHTML = activityPanelHtml();
    return;
  }

  if (panelView === "relations") {
    panel.classList.add("is-active", "is-interactive", "is-view");
    panel.innerHTML = relationsPanelHtml();
    return;
  }

  if (panelView === "timeline") {
    panel.classList.add("is-active", "is-interactive", "is-view");
    panel.innerHTML = timelinePanelHtml();
    return;
  }

  if (record) {
    panel.classList.add("is-active");
    panel.innerHTML = projectPanelHtml(record.entity, false);
    return;
  }

  panel.classList.add("is-dashboard", "is-interactive");
  panel.innerHTML = defaultPanelHtml();
}

function applyTwinState(state) {
  if (!PROFILE.twin.states[state]) return;
  twinState = state;
  const config = PROFILE.twin.states[state];
  const color = new THREE.Color(config.color);
  const emissive = new THREE.Color(config.emissive);

  twinCore.material.color.copy(color);
  twinCore.material.emissive.copy(emissive);
  twinCore.material.emissiveIntensity = config.intensity;
  twinWireframe.material.color.copy(color);
  twinAura.material.color.copy(color);
  twinRingA.material.color.copy(color);
  twinRingB.material.color.copy(color);
  twinLight.color.copy(color);
  twinLight.intensity = state === "idle" ? 4.5 : state === "thinking" ? 7 : 10;
  twinLine.material.color.copy(color);

  if (focusedRecord === twinRecord) renderPanel(twinRecord);
}

function getLayout() {
  const width = window.innerWidth;
  if (width > 900) {
    return {
      constellationPosition: new THREE.Vector3(2.15, 0, 0),
      constellationScale: 1,
      camera: new THREE.Vector3(0.6, 0.25, 10.8),
      target: new THREE.Vector3(1.2, 0, 0),
    };
  }
  if (width > 620) {
    return {
      constellationPosition: new THREE.Vector3(0.6, -0.7, 0),
      constellationScale: 0.94,
      camera: new THREE.Vector3(0.3, 0.1, 11.5),
      target: new THREE.Vector3(0.3, -0.55, 0),
    };
  }
  return {
    constellationPosition: new THREE.Vector3(0, -1.28, 0),
    constellationScale: 0.76,
    camera: new THREE.Vector3(0, 0.25, 12.4),
    target: new THREE.Vector3(0, -1.2, 0),
  };
}

function applyResponsiveLayout({ resetCamera = false } = {}) {
  const layout = getLayout();
  constellation.position.copy(layout.constellationPosition);
  constellation.scale.setScalar(layout.constellationScale);

  if (resetCamera || !focusedRecord) {
    desiredCamera.copy(layout.camera);
    desiredTarget.copy(layout.target);
    if (resetCamera) {
      camera.position.copy(layout.camera);
      controls.target.copy(layout.target);
      controls.update();
    }
  }
}

function startCameraTransition(target, distance = 4.6) {
  desiredTarget.copy(target);
  desiredCamera.set(target.x + 0.2, target.y + 0.3, target.z + distance);
  cameraTransition = true;
  controls.enabled = false;
}

function focusRecord(record) {
  if (!record) return;
  focusedRecord = record;
  panelView = "record";
  hoveredRecord = null;
  document.body.classList.add("is-focused");

  const worldPosition = new THREE.Vector3();
  record.group.getWorldPosition(worldPosition);
  startCameraTransition(worldPosition, record.entity.kind === "twin" ? 4.2 : 4.5);
  renderPanel(record);
}

function clearFocus({ preserveView = false } = {}) {
  focusedRecord = null;
  document.body.classList.remove("is-focused");
  if (!preserveView) panelView = "default";
  const layout = getLayout();
  desiredCamera.copy(layout.camera);
  desiredTarget.copy(layout.target);
  cameraTransition = true;
  controls.enabled = false;
  renderPanel();
}

function updatePointer(event) {
  pointer.x = (event.clientX / window.innerWidth) * 2 - 1;
  pointer.y = -(event.clientY / window.innerHeight) * 2 + 1;
}

function pickRecord(clientX, clientY) {
  pointer.x = (clientX / window.innerWidth) * 2 - 1;
  pointer.y = -(clientY / window.innerHeight) * 2 + 1;
  raycaster.setFromCamera(pointer, camera);
  const hit = raycaster.intersectObjects(interactiveTargets, false)[0];
  return hit?.object?.userData?.record ?? null;
}

function findProject(query) {
  const normalized = query.trim().toLowerCase();
  if (!normalized) return null;
  return PROFILE.projects.find(
    (project) =>
      project.id.toLowerCase() === normalized ||
      project.name.toLowerCase() === normalized ||
      project.name.toLowerCase().includes(normalized),
  );
}

function appendConsole(kind, text) {
  consoleTranscript.push({ kind, text });
  consoleTranscript = consoleTranscript.slice(-12);
}

function executeTwinCommand(rawCommand) {
  const raw = rawCommand.trim();
  if (!raw) return;
  appendConsole("user", raw);

  const normalized = raw.toLowerCase().replace(/^show\s+/, "").trim();
  const [command, ...rest] = normalized.split(/\s+/);
  const argument = rest.join(" ").trim();

  if (command === "clear") {
    consoleTranscript = [];
    renderPanel(twinRecord);
    return;
  }

  if (command === "help") {
    appendConsole("system", "Commands: projects · relations · activity · timeline · focus <project> · open <project> · state <idle|thinking|building> · clear");
  } else if (command === "projects") {
    appendConsole("system", PROFILE.projects.map((project) => `${project.name} [${project.status}]`).join(" · "));
  } else if (command === "relations" || command === "graph") {
    appendConsole("system", (PROFILE.relations || []).map((relation) => `${relation.source} → ${relation.target}: ${relation.label}`).join(" · "));
  } else if (command === "activity") {
    appendConsole("system", activitySummaryText());
  } else if (command === "timeline") {
    appendConsole("system", (PROFILE.timeline || []).map((item) => `${item.phase} ${item.title}`).join(" → "));
  } else if (command === "state") {
    if (!PROFILE.twin.states[argument]) {
      appendConsole("error", "State must be idle, thinking or building.");
    } else {
      applyTwinState(argument);
      appendConsole("system", `Twin state changed to ${PROFILE.twin.states[argument].label}.`);
    }
  } else if (command === "focus" || command === "about") {
    const project = findProject(argument);
    if (!project) {
      appendConsole("error", `No project matches “${argument || "?"}”. Try projects.`);
    } else {
      appendConsole("system", `Entering Project Focus: ${project.name}.`);
      focusRecord(recordsById.get(project.id));
      return;
    }
  } else if (command === "open") {
    const project = findProject(argument);
    if (!project) {
      appendConsole("error", `No project matches “${argument || "?"}”. Try projects.`);
    } else {
      appendConsole("system", `Opening ${project.name}.`);
      window.open(project.url, "_blank", "noopener,noreferrer");
    }
  } else {
    appendConsole("error", "Unknown local command. Type help.");
  }

  renderPanel(twinRecord);
  requestAnimationFrame(() => panel.querySelector(".console-input")?.focus());
}

window.addEventListener("pointermove", (event) => {
  updatePointer(event);
  if (focusedRecord || panelView !== "default") return;

  const next = pickRecord(event.clientX, event.clientY);
  if (next === hoveredRecord) return;
  hoveredRecord = next;
  document.body.style.cursor = hoveredRecord ? "pointer" : "default";
  renderPanel(hoveredRecord);
});

window.addEventListener("pointerdown", (event) => {
  pointerDown = { x: event.clientX, y: event.clientY };
});

window.addEventListener("pointerup", (event) => {
  if (!pointerDown) return;
  const distance = Math.hypot(event.clientX - pointerDown.x, event.clientY - pointerDown.y);
  pointerDown = null;
  if (distance > 8) return;

  const record = pickRecord(event.clientX, event.clientY);
  if (record) focusRecord(record);
});

window.addEventListener("pointerleave", () => {
  pointer.set(99, 99);
  if (!focusedRecord && panelView === "default") {
    hoveredRecord = null;
    document.body.style.cursor = "default";
    renderPanel();
  }
});

panel.addEventListener("click", (event) => {
  const focusTarget = event.target.closest("[data-focus-id]");
  if (focusTarget) {
    const record = recordsById.get(focusTarget.dataset.focusId);
    if (record) focusRecord(record);
    return;
  }

  const target = event.target.closest("button");
  if (!target) return;

  const action = target.dataset.action;
  const state = target.dataset.twinState;

  if (state) {
    applyTwinState(state);
    return;
  }

  if (action === "back") {
    clearFocus();
  } else if (action === "back-panel") {
    panelView = "default";
    renderPanel();
  } else if (action === "back-to-record" && focusedRecord) {
    panelView = "record";
    renderPanel(focusedRecord);
  } else if (action === "open-repo" && focusedRecord?.entity?.url) {
    window.open(focusedRecord.entity.url, "_blank", "noopener,noreferrer");
  } else if (action === "open-twin") {
    focusRecord(twinRecord);
  } else if (action === "show-activity") {
    if (focusedRecord) clearFocus({ preserveView: true });
    panelView = "activity";
    renderPanel();
  } else if (action === "show-relations") {
    panelView = "relations";
    renderPanel();
  } else if (action === "show-timeline") {
    if (focusedRecord) clearFocus({ preserveView: true });
    panelView = "timeline";
    renderPanel();
  } else if (action === "refresh-activity") {
    activityStatus = "loading";
    updateActivityStatus();
    renderPanel();
    loadActivity();
  }
});

panel.addEventListener("submit", (event) => {
  const form = event.target.closest("[data-console-form]");
  if (!form) return;
  event.preventDefault();
  const input = form.elements.command;
  const command = input?.value || "";
  if (input) input.value = "";
  executeTwinCommand(command);
});

window.addEventListener("keydown", (event) => {
  if (event.key === "Escape") {
    if (focusedRecord) {
      clearFocus();
    } else if (panelView !== "default") {
      panelView = "default";
      renderPanel();
    }
  }
});

function animateRecord(record, elapsed) {
  const isFocused = focusedRecord === record;
  const isDimmed = Boolean(focusedRecord && !isFocused);
  const isHovered = !focusedRecord && panelView === "default" && hoveredRecord === record;
  const targetScale = isFocused ? 1.2 : isDimmed ? 0.64 : isHovered ? 1.1 : 1;
  const nextScale = THREE.MathUtils.lerp(record.group.scale.x, targetScale, 0.08);
  record.group.scale.setScalar(nextScale);

  const targetMeshOpacity = isDimmed ? 0.2 : record.baseMeshOpacity;
  record.mesh.material.opacity = THREE.MathUtils.lerp(record.mesh.material.opacity, targetMeshOpacity, 0.08);
  record.label.material.opacity = THREE.MathUtils.lerp(record.label.material.opacity, isDimmed ? 0.18 : 1, 0.08);
  record.line.material.opacity = THREE.MathUtils.lerp(
    record.line.material.opacity,
    isDimmed ? 0.05 : record.baseLineOpacity,
    0.08,
  );

  if (!prefersReducedMotion) {
    const base = record.group.userData.basePosition;
    const phase = record.group.userData.phase;
    const amplitude = isFocused ? 0.025 : 0.085;
    record.group.position.x = base.x + Math.cos(elapsed * 0.42 + phase) * amplitude;
    record.group.position.y = base.y + Math.sin(elapsed * 0.58 + phase) * amplitude * 1.2;
    record.group.position.z = base.z + Math.sin(elapsed * 0.36 + phase) * amplitude * 0.8;
    record.mesh.rotation.y += record.entity.kind === "twin" ? 0.006 : 0.003;
  }
}

function animateRelation(record, elapsed) {
  const source = record.source.group.position;
  const target = record.target.group.position;
  const attribute = record.line.geometry.getAttribute("position");
  attribute.setXYZ(0, source.x, source.y, source.z);
  attribute.setXYZ(1, target.x, target.y, target.z);
  attribute.needsUpdate = true;

  const focusId = focusedRecord?.entity?.id;
  const connected = focusId && (record.relation.source === focusId || record.relation.target === focusId);
  const targetOpacity = focusedRecord ? (connected ? 0.76 : 0.025) : record.baseOpacity;
  record.line.material.opacity = THREE.MathUtils.lerp(record.line.material.opacity, targetOpacity, 0.09);

  const progress = prefersReducedMotion ? 0.5 : (elapsed * 0.14 + record.phase) % 1;
  record.particle.position.lerpVectors(source, target, progress);
  record.particle.material.opacity = THREE.MathUtils.lerp(
    record.particle.material.opacity,
    focusedRecord && !connected ? 0.03 : connected ? 0.9 : 0.42,
    0.09,
  );
}

function animateActivity(elapsed) {
  const dimmed = Boolean(focusedRecord);
  activityGroup.rotation.z = prefersReducedMotion ? 0 : elapsed * 0.018;
  activityNodes.forEach((record, index) => {
    const pulse = prefersReducedMotion ? 1 : 1 + Math.sin(elapsed * 2.2 + record.phase) * 0.22;
    record.mesh.scale.setScalar(pulse);
    record.mesh.material.opacity = THREE.MathUtils.lerp(record.mesh.material.opacity, dimmed ? 0.08 : 0.58, 0.08);
    if (!prefersReducedMotion) record.mesh.position.z = record.base.z + Math.sin(elapsed * 0.7 + index) * 0.08;
  });
}

const clock = new THREE.Clock();

function animate() {
  const elapsed = clock.getElapsedTime();

  if (cameraTransition) {
    camera.position.lerp(desiredCamera, 0.085);
    controls.target.lerp(desiredTarget, 0.1);
    if (camera.position.distanceTo(desiredCamera) < 0.025 && controls.target.distanceTo(desiredTarget) < 0.025) {
      camera.position.copy(desiredCamera);
      controls.target.copy(desiredTarget);
      cameraTransition = false;
      controls.enabled = true;
    }
  } else {
    controls.update();
  }

  if (!prefersReducedMotion) {
    core.rotation.x = elapsed * 0.08;
    core.rotation.y = elapsed * 0.14;
    wireframe.rotation.x = -elapsed * 0.05;
    wireframe.rotation.y = elapsed * 0.08;
    halo.scale.setScalar(1 + Math.sin(elapsed * 1.5) * 0.018);
    stars.rotation.y = elapsed * 0.0022;
    twinWireframe.rotation.x = elapsed * 0.18;
    twinWireframe.rotation.y = -elapsed * 0.24;
    twinRingA.rotation.z = elapsed * 0.18;
    twinRingB.rotation.z = -elapsed * 0.12;
    twinAura.scale.setScalar(1 + Math.sin(elapsed * 2) * 0.035);
  }

  records.forEach((record) => animateRecord(record, elapsed));
  relationRecords.forEach((record) => animateRelation(record, elapsed));
  animateActivity(elapsed);
  renderer.render(scene, camera);
  requestAnimationFrame(animate);
}

function onResize() {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
  renderer.setSize(window.innerWidth, window.innerHeight, false);
  applyResponsiveLayout();
}

window.addEventListener("resize", onResize, { passive: true });
applyTwinState(twinState);
applyResponsiveLayout({ resetCamera: true });
updateActivityStatus();
renderPanel();
animate();
loadActivity();
