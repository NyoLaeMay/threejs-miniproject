import * as THREE from "three";
import { FontLoader } from "three/addons/loaders/FontLoader.js";
import { TextGeometry } from "three/addons/geometries/TextGeometry.js";
import { OrbitControls } from "three/addons/controls/OrbitControls.js";

const ANIMATION_SPEED = {
  text: 0.01,
  bounce: 0.02,
  sphere: 0.02,
  torus: 0.005,
};

let speedMultiplier = 1;
let bouncingEnabled = false;
let animationStartTime = 0;

const COLORS = {
  sphere: 0xff6b35,
  torus: 0x4ecdc4,
  text: 0xff3366,
  background: 0xfff0f5,
};

const COLOR_PALETTES = {
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
  const ambientLight = new THREE.AmbientLight(0xffd1dc, 0.5);
  scene.add(ambientLight);

  const directionalLight = new THREE.DirectionalLight(0xffffff, 1);
  directionalLight.position.set(5, 10, 5);
  directionalLight.castShadow = true;
  directionalLight.shadow.mapSize.width = 2048;
  directionalLight.shadow.mapSize.height = 2048;
  scene.add(directionalLight);

  const pointLight = new THREE.PointLight(0xff6b35, 0.8, 50);
  pointLight.position.set(-5, 3, 0);
  scene.add(pointLight);
  return { directionalLight, pointLight };
}

function createSphere() {
  const geometry = new THREE.SphereGeometry(0.4, 32, 32);
  const material = new THREE.MeshPhongMaterial({
    color: COLORS.sphere,
    shininess: 150,
  });
  const sphere = new THREE.Mesh(geometry, material);
  sphere.castShadow = true;
  sphere.receiveShadow = true;
  sphere.position.set(-3, 1, -1);
  scene.add(sphere);
  return sphere;
}

function createTorus() {
  const geometry = new THREE.TorusGeometry(0.7, 0.1, 16, 100);
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
    color: 0xffe4e1,
    side: THREE.DoubleSide,
  });
  const ground = new THREE.Mesh(geometry, material);
  ground.rotation.x = -Math.PI / 2;
  ground.position.y = -1;
  ground.receiveShadow = true;
  scene.add(ground);
  return ground;
}

function createFloatingHearts() {
  const hearts = [];
  for (let i = 0; i < 20; i++) {
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
      depth: 1,
      bevelEnabled: true,
      bevelThickness: 0.5,
      bevelSize: 0.5,
      bevelSegments: 2,
    };

    const geometry = new THREE.ExtrudeGeometry(shape, extrudeSettings);
    const material = new THREE.MeshPhongMaterial({
      color: Math.random() * 0xffffff,
      shininess: 100,
    });
    const heart = new THREE.Mesh(geometry, material);

    heart.position.set(
      (Math.random() - 0.5) * 10,
      Math.random() * 6 + 1,
      (Math.random() - 0.5) * 10
    );

    const randomScale = 0.025 + Math.random() * 0.015;
    heart.scale.set(randomScale, randomScale, randomScale);
    heart.rotation.x = Math.PI;

    heart.castShadow = true;
    scene.add(heart);
    hearts.push(heart);
  }
  return hearts;
}

function createText() {
  const loader = new FontLoader();
  loader.load(
    "https://threejs.org/examples/fonts/helvetiker_regular.typeface.json",
    (font) => {
      const textGeometry = new TextGeometry("Hello World !", {
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

      initialTextPosition = {
        x: centerOffsetX,
        y: centerOffsetY + 3,
        z: -2,
      };
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

function createRain() {
  const rainCount = 100;
  const rainHearts = [];

  const heartShape = new THREE.Shape();
  const x = -1,
    y = -1;
  heartShape.moveTo(x + 1, y + 1);
  heartShape.bezierCurveTo(x + 1, y + 1, x + 0.8, y + 0.4, x + 0.4, y + 0.4);
  heartShape.bezierCurveTo(
    x + 0.1,
    y + 0.4,
    x + 0.1,
    y + 0.7,
    x + 0.1,
    y + 0.7
  );
  heartShape.bezierCurveTo(x + 0.1, y + 0.9, x + 0.3, y + 1.1, x + 1, y + 1.4);
  heartShape.bezierCurveTo(
    x + 1.7,
    y + 1.1,
    x + 1.9,
    y + 0.9,
    x + 1.9,
    y + 0.7
  );
  heartShape.bezierCurveTo(
    x + 1.9,
    y + 0.7,
    x + 1.9,
    y + 0.4,
    x + 1.6,
    y + 0.4
  );
  heartShape.bezierCurveTo(x + 1.2, y + 0.4, x + 1, y + 1, x + 1, y + 1);

  const extrudeSettings = {
    steps: 1,
    depth: 0.1,
    bevelEnabled: false,
  };

  const heartGeometry = new THREE.ExtrudeGeometry(heartShape, extrudeSettings);

  for (let i = 0; i < rainCount; i++) {
    const colors = [
      0xff69b4, 0xff1493, 0xffc0cb, 0xff6347, 0xff4500, 0xffd700, 0x87ceeb,
    ];
    const material = new THREE.MeshPhongMaterial({
      color: colors[Math.floor(Math.random() * colors.length)],
      transparent: true,
      opacity: 0.8,
      shininess: 100,
    });

    const heart = new THREE.Mesh(heartGeometry, material);

    heart.position.set(
      (Math.random() - 0.5) * 20,
      Math.random() * 15 + 5,
      (Math.random() - 0.5) * 20
    );

    heart.scale.set(0.12, 0.12, 0.12);
    heart.rotation.x = Math.PI;
    heart.castShadow = true;

    heart.userData = {
      velocityX: (Math.random() - 0.5) * 0.005,
      velocityY: -0.04 - Math.random() * 0.02,
      velocityZ: (Math.random() - 0.5) * 0.005,
      rotationSpeed: Math.random() * 0.01,
    };

    scene.add(heart);
    rainHearts.push(heart);
  }

  return { rainHearts };
}

const lights = createLights();
const sphere = createSphere();
const torus = createTorus();
const ground = createGround();
const floatingHearts = createFloatingHearts();
let textMesh = null;
let initialTextPosition = { x: 0, y: 5, z: -2 };
const controls = setupControls();
let rainSystem = createRain();
createText();

function animate() {
  const time = Date.now() * 0.001;

  if (bouncingEnabled) {
    const torusBaseY = 1 + Math.cos(time * 1.5 * speedMultiplier) * 0.2;

    sphere.rotation.y += ANIMATION_SPEED.sphere * speedMultiplier;
    sphere.position.y = 1;

    if (Math.random() < 0.01) {
      const colors = [
        0xff6b35, 0xff1493, 0x00ff88, 0x4ecdc4, 0xf9ca24, 0xff3366, 0x6c5ce7,
        0xfd79a8, 0xa29bfe,
      ];
      const randomColor = colors[Math.floor(Math.random() * colors.length)];
      sphere.material.color.setHex(randomColor);
    }

    torus.rotation.x += ANIMATION_SPEED.torus * speedMultiplier;
    torus.rotation.y += ANIMATION_SPEED.torus * 2 * speedMultiplier;
    torus.position.y = torusBaseY;

    sphere.position.x =
      torus.position.x + Math.sin(time * 1.8 * speedMultiplier) * 0.1;
    sphere.position.z =
      torus.position.z + Math.cos(time * 1.8 * speedMultiplier) * 0.1;

    floatingHearts.forEach((heart, index) => {
      heart.rotation.x += 0.01 * (index + 1) * speedMultiplier;
      heart.rotation.y += 0.008 * (index + 1) * speedMultiplier;
      heart.position.y += Math.sin(time * 2 + index) * 0.002 * speedMultiplier;
    });

    lights.pointLight.position.x = Math.sin(time * speedMultiplier) * 5;
    lights.pointLight.position.z = Math.cos(time * speedMultiplier) * 5;
  }

  if (textMesh) {
    if (bouncingEnabled) {
      const animTime = time - animationStartTime;

      textMesh.rotation.y += ANIMATION_SPEED.text * speedMultiplier;
      textMesh.rotation.x = Math.sin(animTime * 1.2 * speedMultiplier) * 0.3;
      textMesh.rotation.z = Math.cos(animTime * 0.8 * speedMultiplier) * 0.2;

      textMesh.position.x =
        initialTextPosition.x + Math.sin(animTime * 0.5 * speedMultiplier) * 2;
      textMesh.position.y =
        initialTextPosition.y + Math.sin(animTime * speedMultiplier) * 0.8;
      textMesh.position.z =
        initialTextPosition.z + Math.sin(animTime * speedMultiplier * 2) * 0.5;

      const pulseScale = 1 + Math.sin(animTime * 3 * speedMultiplier) * 0.1;
      textMesh.scale.setScalar(pulseScale);
    }
  }

  if (rainEnabled) {
    const { rainHearts } = rainSystem;

    rainHearts.forEach((heart) => {
      heart.position.x += heart.userData.velocityX;
      heart.position.y += heart.userData.velocityY;
      heart.position.z += heart.userData.velocityZ;

      heart.rotation.y += heart.userData.rotationSpeed;
      heart.rotation.z += heart.userData.rotationSpeed * 0.5;

      if (heart.position.y < -1) {
        heart.position.set(
          (Math.random() - 0.5) * 20,
          Math.random() * 15 + 5,
          (Math.random() - 0.5) * 20
        );
        heart.rotation.y = 0;
        heart.rotation.z = 0;
      }
    });
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
  let currentTextColorIndex = 0;

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

    if (bouncingEnabled) {
      animationStartTime = Date.now() * 0.001;
    }

    document.getElementById("toggleBounce").textContent = bouncingEnabled
      ? "Stop Animation"
      : "Start Animation";
  });

  document.getElementById("resetScene").addEventListener("click", () => {
    if (textMesh) {
      textMesh.material.color.setHex(COLORS.text);
      textMesh.position.set(
        initialTextPosition.x,
        initialTextPosition.y,
        initialTextPosition.z
      );
      textMesh.scale.setScalar(1);
      textMesh.rotation.x = 0;
      textMesh.rotation.y = 0;
      textMesh.rotation.z = 0;
    }

    sphere.position.set(-3, 1, -1);
    torus.position.set(-3, 1, -1);
    sphere.rotation.y = 0;
    torus.rotation.x = 0;
    torus.rotation.y = 0;

    floatingHearts.forEach((heart, index) => {
      heart.rotation.x = Math.PI;
      heart.rotation.y = 0;
    });

    speedMultiplier = 1;
    bouncingEnabled = false;

    document.getElementById("toggleSpeed").textContent =
      "Toggle Animation Speed";
    document.getElementById("toggleBounce").textContent = "Start Animation";

    currentTextColorIndex = 0;
  });
}

setupButtons();

const rainBtn = document.createElement("button");
rainBtn.id = "toggleRain";
rainBtn.textContent = "Toggle Heart Rain";
rainBtn.style.position = "fixed";
rainBtn.style.top = "70px";
rainBtn.style.right = "20px";
rainBtn.style.zIndex = "10";
rainBtn.style.padding = "10px 20px";
rainBtn.style.fontSize = "16px";
document.body.appendChild(rainBtn);

let rainEnabled = true;

rainBtn.addEventListener("click", () => {
  rainEnabled = !rainEnabled;
  rainSystem.rainHearts.forEach((heart) => {
    heart.visible = rainEnabled;
  });
  rainBtn.textContent = rainEnabled ? "Stop Heart Rain" : "Start Heart Rain";
  console.log(rainEnabled ? "Heart rain started!" : "Heart rain stopped!");
});
