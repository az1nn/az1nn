import * as THREE from "three";
import { OrbitControls } from "three/addons/controls/OrbitControls.js";
import { PROFILE } from "./profile.config.js";

const canvas = document.querySelector("#scene");
const panel = document.querySelector("#project-panel");
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
    new THREE.SpriteMaterial({
      map: texture,
      transparent: true,
      depthWrite: false,
    }),
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
    new THREE.MeshBasicMaterial({
      color: 0xc4b5fd,
      transparent: true,
      opacity: 0.34,
    }),
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

let twinState = "thinking";

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

function projectPanelHtml(project) {
  const tags = (project.tags || [])
    .map((tag) => `<span class="panel-tag">${escapeHtml(tag)}</span>`)
    .join("");

  return `
    <div class="panel-topline">
      <span class="panel-kicker">${escapeHtml(project.category || "PROJECT")} · ${escapeHtml(project.status || "ACTIVE")}</span>
      <span class="panel-mode">PROJECT FOCUS</span>
    </div>
    <h2>${escapeHtml(project.name)}</h2>
    <p>${escapeHtml(project.short)}</p>
    <div class="panel-tags">${tags}</div>
    <div class="panel-actions">
      <button type="button" class="panel-button primary" data-action="open-repo">Open repository ↗</button>
      <button type="button" class="panel-button" data-action="back">Back to constellation</button>
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
      <span class="panel-mode twin-mode">DIGITAL COUNTERPART</span>
    </div>
    <h2>${escapeHtml(PROFILE.twin.name)}</h2>
    <p>${escapeHtml(state.description)}</p>
    <div class="panel-tags">${capabilities}</div>
    <div class="twin-state-picker" aria-label="AI Twin state">${states}</div>
    <div class="panel-actions">
      <button type="button" class="panel-button" data-action="back">Back to constellation</button>
    </div>
  `;
}

function defaultPanelHtml() {
  return `
    <span class="panel-kicker">SYSTEM MAP</span>
    <h2>Engineering constellation</h2>
    <p>Projects, experiments and the AI Twin are rendered from one profile configuration.</p>
    <span class="panel-action-hint">select a node to inspect it</span>
  `;
}

function renderPanel(record = focusedRecord || hoveredRecord) {
  if (!record) {
    panel.classList.remove("is-active", "is-twin");
    panel.innerHTML = defaultPanelHtml();
    return;
  }

  panel.classList.add("is-active");
  panel.classList.toggle("is-twin", record.entity.kind === "twin");
  panel.innerHTML = record.entity.kind === "twin" ? twinPanelHtml() : projectPanelHtml(record.entity);
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
  focusedRecord = record;
  document.body.classList.add("is-focused");

  const worldPosition = new THREE.Vector3();
  record.group.getWorldPosition(worldPosition);
  startCameraTransition(worldPosition, record.entity.kind === "twin" ? 4.2 : 4.5);
  renderPanel(record);
}

function clearFocus() {
  focusedRecord = null;
  document.body.classList.remove("is-focused");
  const layout = getLayout();
  desiredCamera.copy(layout.camera);
  desiredTarget.copy(layout.target);
  cameraTransition = true;
  controls.enabled = false;
  renderPanel(hoveredRecord);
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

window.addEventListener("pointermove", (event) => {
  updatePointer(event);
  if (focusedRecord) return;

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
  if (!focusedRecord) {
    hoveredRecord = null;
    document.body.style.cursor = "default";
    renderPanel();
  }
});

panel.addEventListener("click", (event) => {
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
    return;
  }

  if (action === "open-repo" && focusedRecord?.entity?.url) {
    window.open(focusedRecord.entity.url, "_blank", "noopener,noreferrer");
  }
});

window.addEventListener("keydown", (event) => {
  if (event.key === "Escape" && focusedRecord) {
    clearFocus();
  }
});

function animateRecord(record, elapsed) {
  const isFocused = focusedRecord === record;
  const isDimmed = Boolean(focusedRecord && !isFocused);
  const isHovered = !focusedRecord && hoveredRecord === record;
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
renderPanel();
animate();
