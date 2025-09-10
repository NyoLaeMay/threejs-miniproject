import * as THREE from "three";
import { FontLoader } from "three/addons/loaders/FontLoader.js";
import { TextGeometry } from "three/addons/geometries/TextGeometry.js";
import { OrbitControls } from "three/addons/controls/OrbitControls.js";

const ANIMATION_SPEED = {
  cube: 0.01,
  text: 0.01,
  bounce: 0.02,
  sphere: 0.02,
  torus: 0.005,
};

let speedMultiplier = 1;
let bouncingEnabled = true;

const COLORS = {
  cube: 0x00ff88,
  sphere: 0xff6b35,
  torus: 0x4ecdc4,
  text: 0xff3366,
  background: 0x1a1a2e,
};

const COLOR_PALETTES = {
  cube: [0x00ff88, 0xff6b35, 0x4ecdc4, 0xff3366, 0xf9ca24, 0x6c5ce7],
  text: [0xff3366, 0x00ff88, 0x4ecdc4, 0xff6b35, 0xa29bfe, 0xfd79a8],
};

const CAMERA_CONFIG = {
  fov: 75,
  near: 0.1,
  far: 1000,
  position: { x: 0, y: 2, z: 8 },
};

const CONTROLS_CONFIG = {
  enableDamping: true,
  dampingFactor: 0.05,
  screenSpacePanning: false,
  minDistance: 1,
  maxDistance: 100,
};

const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(
  CAMERA_CONFIG.fov,
  window.innerWidth / window.innerHeight,
  CAMERA_CONFIG.near,
  CAMERA_CONFIG.far
);
camera.position.set(
  CAMERA_CONFIG.position.x,
  CAMERA_CONFIG.position.y,
  CAMERA_CONFIG.position.z
);

const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.shadowMap.enabled = true;
renderer.shadowMap.type = THREE.PCFSoftShadowMap;

// Set background color
scene.background = new THREE.Color(COLORS.background);

document.body.appendChild(renderer.domElement);

function createLights() {
  // Ambient light for overall illumination
  const ambientLight = new THREE.AmbientLight(0x404040, 0.4);
  scene.add(ambientLight);

  // Directional light with shadows
  const directionalLight = new THREE.DirectionalLight(0xffffff, 1);
  directionalLight.position.set(5, 10, 5);
  directionalLight.castShadow = true;
  directionalLight.shadow.mapSize.width = 2048;
  directionalLight.shadow.mapSize.height = 2048;
  scene.add(directionalLight);

  // Point light for dramatic effect
  const pointLight = new THREE.PointLight(0xff6b35, 0.8, 50);
  pointLight.position.set(-5, 3, 0);
  scene.add(pointLight);
  return { directionalLight, pointLight };
}

function createCube() {
  const geometry = new THREE.BoxGeometry(1, 1, 1);
  const material = new THREE.MeshPhongMaterial({
    color: COLORS.cube,
    shininess: 100,
    specular: 0x222222,
  });
  const cube = new THREE.Mesh(geometry, material);
  cube.castShadow = true;
  cube.receiveShadow = true;
  cube.position.set(0, 1, 0);
  scene.add(cube);
  return cube;
}

function createSphere() {
  const geometry = new THREE.SphereGeometry(0.8, 32, 32);
  const material = new THREE.MeshPhongMaterial({
    color: COLORS.sphere,
    shininess: 150,
  });
  const sphere = new THREE.Mesh(geometry, material);
  sphere.castShadow = true;
  sphere.receiveShadow = true;
  sphere.position.set(3, 1, -2);
  scene.add(sphere);
  return sphere;
}

function createTorus() {
  const geometry = new THREE.TorusGeometry(0.7, 0.2, 16, 100);
  const material = new THREE.MeshPhongMaterial({
    color: COLORS.torus,
    shininess: 80,
  });
  const torus = new THREE.Mesh(geometry, material);
  torus.castShadow = true;
  torus.receiveShadow = true;
  torus.position.set(-3, 1, -1);
  scene.add(torus);
  return torus;
}

function createGround() {
  const geometry = new THREE.PlaneGeometry(20, 20);
  const material = new THREE.MeshPhongMaterial({
    color: 0x333333,
    side: THREE.DoubleSide,
  });
  const ground = new THREE.Mesh(geometry, material);
  ground.rotation.x = -Math.PI / 2;
  ground.position.y = -1;
  ground.receiveShadow = true;
  scene.add(ground);
  return ground;
}

function createFloatingCubes() {
  const cubes = [];
  for (let i = 0; i < 8; i++) {
    const geometry = new THREE.BoxGeometry(0.2, 0.2, 0.2);
    const material = new THREE.MeshPhongMaterial({
      color: Math.random() * 0xffffff,
    });
    const cube = new THREE.Mesh(geometry, material);

    cube.position.set(
      (Math.random() - 0.5) * 10,
      Math.random() * 4 + 2,
      (Math.random() - 0.5) * 10
    );

    cube.castShadow = true;
    scene.add(cube);
    cubes.push(cube);
  }
  return cubes;
}

function createHeart() {
  const shape = new THREE.Shape();
  const x = -2.5;
  const y = -5;
  shape.moveTo(x + 2.5, y + 2.5);
  shape.bezierCurveTo(x + 2.5, y + 2.5, x + 2, y, x, y);
  shape.bezierCurveTo(x - 3, y, x - 3, y + 3.5, x - 3, y + 3.5);
  shape.bezierCurveTo(x - 3, y + 5.5, x - 1.5, y + 7.7, x + 2.5, y + 9.5);
  shape.bezierCurveTo(x + 6, y + 7.7, x + 8, y + 4.5, x + 8, y + 3.5);
  shape.bezierCurveTo(x + 8, y + 3.5, x + 8, y, x + 5, y);
  shape.bezierCurveTo(x + 3.5, y, x + 2.5, y + 2.5, x + 2.5, y + 2.5);

  const extrudeSettings = {
    steps: 2,
    depth: 2,
    bevelEnabled: true,
    bevelThickness: 1,
    bevelSize: 1,
    bevelSegments: 2,
  };

  const geometry = new THREE.ExtrudeGeometry(shape, extrudeSettings);
  const material = new THREE.MeshPhongMaterial({
    color: 0xff1744,
    shininess: 100,
  });

  const heart = new THREE.Mesh(geometry, material);
  heart.castShadow = true;
  heart.receiveShadow = true;

  // Scale and position the heart
  heart.scale.set(0.1, 0.1, 0.1);
  heart.position.set(-5, 3, 2);
  heart.rotation.x = Math.PI;

  scene.add(heart);
  return heart;
}

function createText() {
  const loader = new FontLoader();
  loader.load(
    "https://threejs.org/examples/fonts/helvetiker_regular.typeface.json",
    (font) => {
      const textGeometry = new TextGeometry("Hello", {
        font: font,
        size: 1,
        depth: 0.2,
        curveSegments: 12,
        bevelEnabled: true,
        bevelThickness: 0.1,
        bevelSize: 0.05,
        bevelSegments: 5,
      });

      textGeometry.computeBoundingBox();
      const centerOffsetX =
        -0.5 *
        (textGeometry.boundingBox.max.x - textGeometry.boundingBox.min.x);
      const centerOffsetY =
        -0.5 *
        (textGeometry.boundingBox.max.y - textGeometry.boundingBox.min.y);

      const textMaterial = new THREE.MeshPhongMaterial({
        color: COLORS.text,
        shininess: 100,
      });
      textMesh = new THREE.Mesh(textGeometry, textMaterial);

      textMesh.position.set(centerOffsetX, centerOffsetY + 3, -2);
      textMesh.castShadow = true;
      scene.add(textMesh);
    }
  );
}

function setupControls() {
  const controls = new OrbitControls(camera, renderer.domElement);
  Object.assign(controls, CONTROLS_CONFIG);
  return controls;
}

// ===== INITIALIZE OBJECTS =====
const lights = createLights();
const cube = createCube();
const sphere = createSphere();
const torus = createTorus();
const ground = createGround();
const floatingCubes = createFloatingCubes();
const heart = createHeart();
let textMesh = null;
const controls = setupControls();

createText();

function animate() {
  const time = Date.now() * 0.001;

  cube.rotation.x += ANIMATION_SPEED.cube * speedMultiplier;
  cube.rotation.y += ANIMATION_SPEED.cube * speedMultiplier;

  sphere.rotation.y += ANIMATION_SPEED.sphere * speedMultiplier;
  sphere.position.y = 1 + Math.sin(time * 2 * speedMultiplier) * 0.3;

  torus.rotation.x += ANIMATION_SPEED.torus * speedMultiplier;
  torus.rotation.y += ANIMATION_SPEED.torus * 2 * speedMultiplier;
  torus.position.y = 1 + Math.cos(time * 1.5 * speedMultiplier) * 0.2;

  floatingCubes.forEach((cube, index) => {
    cube.rotation.x += 0.01 * (index + 1) * speedMultiplier;
    cube.rotation.y += 0.008 * (index + 1) * speedMultiplier;
    cube.position.y += Math.sin(time * 2 + index) * 0.002 * speedMultiplier;
  });

  lights.pointLight.position.x = Math.sin(time * speedMultiplier) * 5;
  lights.pointLight.position.z = Math.cos(time * speedMultiplier) * 5;

  heart.rotation.y += 0.01 * speedMultiplier;
  heart.scale.setScalar(0.1 + Math.sin(time * 4 * speedMultiplier) * 0.02); // Pulsing effect
  heart.position.y = 3 + Math.sin(time * 1.5 * speedMultiplier) * 0.5;

  if (textMesh) {
    textMesh.rotation.y += ANIMATION_SPEED.text * speedMultiplier;
    if (bouncingEnabled) {
      textMesh.position.y =
        Math.sin(time * ANIMATION_SPEED.bounce * 100 * speedMultiplier) * 0.8 +
        5;
    }
  }

  controls.update();
  renderer.render(scene, camera);
}

function handleResize() {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
}

window.addEventListener("resize", handleResize);
renderer.setAnimationLoop(animate);

function setupButtons() {
  let currentCubeColorIndex = 0;
  let currentTextColorIndex = 0;

  document.getElementById("changeColor").addEventListener("click", () => {
    currentCubeColorIndex =
      (currentCubeColorIndex + 1) % COLOR_PALETTES.cube.length;
    const newColor = COLOR_PALETTES.cube[currentCubeColorIndex];
    cube.material.color.setHex(newColor);
  });

  document.getElementById("toggleSpeed").addEventListener("click", () => {
    speedMultiplier =
      speedMultiplier === 1 ? 3 : speedMultiplier === 3 ? 0.5 : 1;
    const speedText =
      speedMultiplier === 1
        ? "Normal"
        : speedMultiplier === 3
        ? "Fast"
        : "Slow";
    document.getElementById("toggleSpeed").textContent = `Speed: ${speedText}`;
  });

  document.getElementById("changeTextColor").addEventListener("click", () => {
    if (textMesh) {
      currentTextColorIndex =
        (currentTextColorIndex + 1) % COLOR_PALETTES.text.length;
      const newColor = COLOR_PALETTES.text[currentTextColorIndex];
      textMesh.material.color.setHex(newColor);
    }
  });

  document.getElementById("toggleBounce").addEventListener("click", () => {
    bouncingEnabled = !bouncingEnabled;
    document.getElementById("toggleBounce").textContent = bouncingEnabled
      ? "Disable Bounce"
      : "Enable Bounce";

    // If bouncing is disabled, fix text position
    if (!bouncingEnabled && textMesh) {
      textMesh.position.y = 5;
    }
  });

  document.getElementById("resetScene").addEventListener("click", () => {
    // Reset colors
    cube.material.color.setHex(COLORS.cube);
    if (textMesh) {
      textMesh.material.color.setHex(COLORS.text);
    }

    speedMultiplier = 1;
    bouncingEnabled = true;

    document.getElementById("toggleSpeed").textContent =
      "Toggle Animation Speed";
    document.getElementById("toggleBounce").textContent = "Toggle Text Bounce";

    currentCubeColorIndex = 0;
    currentTextColorIndex = 0;
  });
}

setupButtons();
