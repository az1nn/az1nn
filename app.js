import * as THREE from "three";
import { OrbitControls } from "three/addons/controls/OrbitControls.js";

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
camera.position.set(0.6, 0.25, 10.8);

const controls = new OrbitControls(camera, renderer.domElement);
controls.enableDamping = true;
controls.dampingFactor = 0.055;
controls.enablePan = false;
controls.minDistance = 6.2;
controls.maxDistance = 14;
controls.rotateSpeed = 0.48;
controls.zoomSpeed = 0.72;
controls.target.set(1.2, 0, 0);

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
constellation.position.x = window.innerWidth > 900 ? 2.1 : 0;
scene.add(constellation);

function createStarField(count = 850) {
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
    opacity: 0.62,
    depthWrite: false,
    sizeAttenuation: true,
  });

  const points = new THREE.Points(geometry, material);
  scene.add(points);
  return points;
}

const stars = createStarField();

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

const projects = [
  {
    name: "OpenBand",
    short: "Music creation + immersive product UX",
    url: "https://github.com/az1nn/openband",
    position: [-3.45, 1.7, -0.35],
    scale: 0.42,
  },
  {
    name: "CPXLABS Admin",
    short: "Enterprise React/Vite + Engineering Graph",
    url: "https://github.com/az1nn/cpxlabs-admin",
    position: [3.3, 1.85, -0.7],
    scale: 0.48,
  },
  {
    name: "PG Researcher",
    short: "AI-assisted research and knowledge workflows",
    url: "https://github.com/az1nn/pg-researcher",
    position: [3.7, -1.75, 0.05],
    scale: 0.38,
  },
  {
    name: "CPX Labs",
    short: "Product engineering, automation and interactive web",
    url: "https://github.com/az1nn/cpx-labs",
    position: [-2.9, -1.85, 0.25],
    scale: 0.43,
  },
  {
    name: "Archive / Systems",
    short: "Experiments, templates and shipped software",
    url: "https://github.com/az1nn?tab=repositories",
    position: [0.4, -3.2, -1.15],
    scale: 0.34,
  },
];

const nodeMeshes = [];
const interactiveTargets = [];
const connectorMaterial = new THREE.LineBasicMaterial({
  color: 0x8b5cf6,
  transparent: true,
  opacity: 0.27,
});

function attachInteraction(object, project, group) {
  object.userData.project = project;
  object.userData.group = group;
  interactiveTargets.push(object);
}

function makeLabel(text) {
  const labelCanvas = document.createElement("canvas");
  const ctx = labelCanvas.getContext("2d");
  const ratio = 2;
  labelCanvas.width = 560 * ratio;
  labelCanvas.height = 94 * ratio;
  ctx.scale(ratio, ratio);
  ctx.clearRect(0, 0, 560, 94);
  ctx.font = "700 25px Inter, system-ui, sans-serif";
  const width = Math.min(520, ctx.measureText(text).width + 42);
  const left = (560 - width) / 2;
  ctx.fillStyle = "rgba(8, 12, 19, 0.78)";
  ctx.strokeStyle = "rgba(167, 139, 250, 0.38)";
  ctx.lineWidth = 1.2;
  ctx.beginPath();
  ctx.roundRect(left, 18, width, 54, 27);
  ctx.fill();
  ctx.stroke();
  ctx.fillStyle = "#e9e5ff";
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  ctx.fillText(text, 280, 45);

  const texture = new THREE.CanvasTexture(labelCanvas);
  texture.colorSpace = THREE.SRGBColorSpace;
  texture.minFilter = THREE.LinearFilter;

  const sprite = new THREE.Sprite(
    new THREE.SpriteMaterial({ map: texture, transparent: true, depthWrite: false }),
  );
  sprite.scale.set(3.45, 0.58, 1);
  return sprite;
}

projects.forEach((project, index) => {
  const position = new THREE.Vector3(...project.position);

  const lineGeometry = new THREE.BufferGeometry().setFromPoints([
    new THREE.Vector3(0, 0, 0),
    position,
  ]);
  const line = new THREE.Line(lineGeometry, connectorMaterial.clone());
  line.material.opacity = 0.18 + index * 0.018;
  constellation.add(line);

  const nodeGroup = new THREE.Group();
  nodeGroup.position.copy(position);
  nodeGroup.userData.basePosition = position.clone();
  nodeGroup.userData.phase = index * 1.37;
  constellation.add(nodeGroup);

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
    }),
  );
  attachInteraction(mesh, project, nodeGroup);
  nodeGroup.add(mesh);
  nodeMeshes.push(mesh);

  const hitTarget = new THREE.Mesh(
    new THREE.SphereGeometry(Math.max(project.scale * 1.75, 0.72), 18, 18),
    new THREE.MeshBasicMaterial({
      transparent: true,
      opacity: 0,
      depthWrite: false,
      colorWrite: false,
    }),
  );
  attachInteraction(hitTarget, project, nodeGroup);
  nodeGroup.add(hitTarget);

  const orbit = new THREE.Mesh(
    new THREE.TorusGeometry(project.scale * 1.48, 0.006, 8, 80),
    new THREE.MeshBasicMaterial({ color: 0xc4b5fd, transparent: true, opacity: 0.34 }),
  );
  orbit.rotation.x = Math.PI / 2;
  nodeGroup.add(orbit);

  const label = makeLabel(project.name);
  label.position.set(0, -(project.scale + 0.58), 0);
  attachInteraction(label, project, nodeGroup);
  nodeGroup.add(label);
});

const raycaster = new THREE.Raycaster();
const pointer = new THREE.Vector2(99, 99);
let hoveredProject = null;
let hoveredGroup = null;
let pointerDown = null;
let selectedProject = null;

function setPanel(project) {
  selectedProject = project ?? null;

  if (!project) {
    panel.classList.remove("is-active");
    panel.innerHTML = `
      <span class="panel-kicker">SELECT A NODE</span>
      <h2>Project constellation</h2>
      <p>Each orbital node represents an active or representative engineering system.</p>
      <span class="panel-action">click a node to open its repository ↗</span>
    `;
    return;
  }

  panel.classList.add("is-active");
  panel.innerHTML = `
    <span class="panel-kicker">PROJECT NODE</span>
    <h2>${project.name}</h2>
    <p>${project.short}</p>
    <span class="panel-action">open repository ↗</span>
  `;
}

function setPointerFromClient(clientX, clientY) {
  const rect = canvas.getBoundingClientRect();
  pointer.x = ((clientX - rect.left) / rect.width) * 2 - 1;
  pointer.y = -((clientY - rect.top) / rect.height) * 2 + 1;
}

function pickAt(clientX, clientY) {
  setPointerFromClient(clientX, clientY);
  raycaster.setFromCamera(pointer, camera);
  const intersection = raycaster.intersectObjects(interactiveTargets, false)[0];

  if (!intersection) return null;

  return {
    project: intersection.object.userData.project,
    group: intersection.object.userData.group,
  };
}

function openProject(project, event) {
  if (!project?.url) return;

  if (event?.metaKey || event?.ctrlKey || event?.shiftKey) {
    window.open(project.url, "_blank", "noopener,noreferrer");
    return;
  }

  window.location.assign(project.url);
}

function updateHover(clientX, clientY) {
  const hit = pickAt(clientX, clientY);
  const nextProject = hit?.project ?? null;
  const nextGroup = hit?.group ?? null;

  if (nextProject === hoveredProject && nextGroup === hoveredGroup) return;

  if (hoveredGroup) {
    hoveredGroup.scale.setScalar(1);
    const previousMesh = hoveredGroup.children.find((child) => nodeMeshes.includes(child));
    if (previousMesh) previousMesh.material.emissiveIntensity = 0.32;
  }

  hoveredProject = nextProject;
  hoveredGroup = nextGroup;

  if (hoveredGroup && hoveredProject) {
    hoveredGroup.scale.setScalar(1.12);
    const currentMesh = hoveredGroup.children.find((child) => nodeMeshes.includes(child));
    if (currentMesh) currentMesh.material.emissiveIntensity = 0.95;
    document.body.style.cursor = "pointer";
    setPanel(hoveredProject);
  } else {
    document.body.style.cursor = "default";
    setPanel(null);
  }
}

canvas.addEventListener("pointermove", (event) => {
  if (event.pointerType === "mouse") {
    updateHover(event.clientX, event.clientY);
  }
});

canvas.addEventListener("pointerdown", (event) => {
  pointerDown = {
    x: event.clientX,
    y: event.clientY,
    pointerId: event.pointerId,
  };
});

window.addEventListener("pointerup", (event) => {
  if (!pointerDown || event.pointerId !== pointerDown.pointerId) return;

  const distance = Math.hypot(event.clientX - pointerDown.x, event.clientY - pointerDown.y);
  pointerDown = null;

  if (distance >= 10) return;

  const hit = pickAt(event.clientX, event.clientY);
  if (hit?.project) {
    openProject(hit.project, event);
  }
});

window.addEventListener("pointercancel", () => {
  pointerDown = null;
});

canvas.addEventListener("pointerleave", () => {
  if (hoveredGroup) {
    hoveredGroup.scale.setScalar(1);
    const mesh = hoveredGroup.children.find((child) => nodeMeshes.includes(child));
    if (mesh) mesh.material.emissiveIntensity = 0.32;
  }
  hoveredProject = null;
  hoveredGroup = null;
  document.body.style.cursor = "default";
  setPanel(null);
});

panel.addEventListener("click", (event) => {
  if (selectedProject) openProject(selectedProject, event);
});

panel.addEventListener("keydown", (event) => {
  if (!selectedProject || (event.key !== "Enter" && event.key !== " ")) return;
  event.preventDefault();
  openProject(selectedProject, event);
});

const clock = new THREE.Clock();

function animate() {
  const elapsed = clock.getElapsedTime();
  controls.update();

  if (!prefersReducedMotion) {
    core.rotation.x = elapsed * 0.08;
    core.rotation.y = elapsed * 0.14;
    wireframe.rotation.x = -elapsed * 0.05;
    wireframe.rotation.y = elapsed * 0.08;
    halo.scale.setScalar(1 + Math.sin(elapsed * 1.5) * 0.018);
    stars.rotation.y = elapsed * 0.0022;

    nodeMeshes.forEach((mesh) => {
      const group = mesh.userData.group;
      const base = group.userData.basePosition;
      const phase = group.userData.phase;
      group.position.x = base.x + Math.cos(elapsed * 0.42 + phase) * 0.08;
      group.position.y = base.y + Math.sin(elapsed * 0.58 + phase) * 0.1;
      group.position.z = base.z + Math.sin(elapsed * 0.36 + phase) * 0.07;
      mesh.rotation.y += 0.003;
    });
  }

  renderer.render(scene, camera);
  requestAnimationFrame(animate);
}

function applyResponsiveLayout() {
  const width = window.innerWidth;

  if (width > 900) {
    constellation.position.set(2.15, 0, 0);
    constellation.scale.setScalar(1);
    controls.target.set(1.2, 0, 0);
    camera.position.z = Math.max(camera.position.z, 9.2);
  } else if (width > 620) {
    constellation.position.set(0.6, -0.65, 0);
    constellation.scale.setScalar(1);
    controls.target.set(0.3, -0.55, 0);
  } else {
    constellation.position.set(0, -1.25, 0);
    constellation.scale.setScalar(0.78);
    controls.target.set(0, -1.2, 0);
  }
}

function onResize() {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
  renderer.setSize(window.innerWidth, window.innerHeight, false);
  applyResponsiveLayout();
}

window.addEventListener("resize", onResize, { passive: true });
applyResponsiveLayout();
animate();
