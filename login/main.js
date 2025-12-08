import * as THREE from 'three';

// --- Configuration ---
const config = {
    rotationSpeed: 0.0003, // Slower for realism
    cloudSpeed: 0.00035,
    starCount: 6000,
    starSize: 0.015,
    cameraZ: 2.5, // Moved back slightly to see more context
};

// --- Scene Setup ---
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
camera.position.z = config.cameraZ;
camera.position.x = 0;

const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setPixelRatio(window.devicePixelRatio);
renderer.toneMapping = THREE.ACESFilmicToneMapping; // Better color handling
renderer.outputColorSpace = THREE.SRGBColorSpace;
document.body.insertBefore(renderer.domElement, document.body.firstChild);

// --- Lighting ---
// Main Sun light - Cool blueish tint
const sunLight = new THREE.DirectionalLight(0xaaddff, 2.0);
sunLight.position.set(5, 3, 5);
scene.add(sunLight);

// Blue ambient light for the dark side
const ambientLight = new THREE.AmbientLight(0x001133, 0.8);
scene.add(ambientLight);

// Add a backlight for the "rim" effect seen in the image
const rimLight = new THREE.DirectionalLight(0x0088ff, 1.5);
rimLight.position.set(-5, 5, -5);
scene.add(rimLight);

// --- Textures ---
const textureLoader = new THREE.TextureLoader();
// Using high-res textures where available (standard Three.js examples are decent)
const texturePath = 'https://raw.githubusercontent.com/mrdoob/three.js/master/examples/textures/planets/';

const earthMap = textureLoader.load(texturePath + 'earth_atmos_2048.jpg');
const earthSpecular = textureLoader.load(texturePath + 'earth_specular_2048.jpg');
const earthNormal = textureLoader.load(texturePath + 'earth_normal_2048.jpg');
const earthClouds = textureLoader.load(texturePath + 'earth_clouds_1024.png');
const moonMap = textureLoader.load(texturePath + 'moon_1024.jpg');

// --- Group for Earth System ---
const earthGroup = new THREE.Group();
scene.add(earthGroup);

// --- Earth Mesh ---
const earthGeometry = new THREE.SphereGeometry(1, 64, 64);
const earthMaterial = new THREE.MeshPhongMaterial({
    map: earthMap,
    specularMap: earthSpecular,
    normalMap: earthNormal,
    color: 0x88bbff, // Tint the earth blue
    specular: new THREE.Color(0x0044ff), // Blue reflection
    shininess: 25,
    emissive: 0x001133, // Slight glow
});
const earth = new THREE.Mesh(earthGeometry, earthMaterial);
earthGroup.add(earth);

// --- Clouds Mesh ---
const cloudGeometry = new THREE.SphereGeometry(1.015, 64, 64);
const cloudMaterial = new THREE.MeshPhongMaterial({
    map: earthClouds,
    transparent: true,
    opacity: 0.8,
    blending: THREE.AdditiveBlending,
    side: THREE.DoubleSide,
    depthWrite: false,
});
const clouds = new THREE.Mesh(cloudGeometry, cloudMaterial);
earthGroup.add(clouds);

// --- Atmosphere Glow (Fresnel Shader) ---
const atmosphereVertexShader = `
varying vec3 vNormal;
void main() {
  vNormal = normalize(normalMatrix * normal);
  gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
}
`;

const atmosphereFragmentShader = `
uniform vec3 glowColor;
varying vec3 vNormal;
void main() {
  float intensity = pow(0.7 - dot(vNormal, vec3(0, 0, 1.0)), 3.0);
  gl_FragColor = vec4(glowColor, 1.0) * intensity * 2.0; 
}
`;

const atmosphereGeometry = new THREE.SphereGeometry(1.2, 64, 64);
const atmosphereMaterial = new THREE.ShaderMaterial({
    uniforms: {
        glowColor: { value: new THREE.Vector3(0.0, 0.6, 1.0) } // Default Cyan/Blue
    },
    vertexShader: atmosphereVertexShader,
    fragmentShader: atmosphereFragmentShader,
    blending: THREE.AdditiveBlending,
    side: THREE.BackSide,
    depthWrite: false
});
const atmosphere = new THREE.Mesh(atmosphereGeometry, atmosphereMaterial);
earthGroup.add(atmosphere);

// --- Matrix Mode Transition ---
window.setMatrixMode = (active) => {
    if (active) {
        earthMaterial.color.setHex(0x002200);
        earthMaterial.emissive.setHex(0x003300);
        earthMaterial.specular.setHex(0x00ff00);
        earthMaterial.wireframe = true;
        clouds.visible = false;
        atmosphereMaterial.uniforms.glowColor.value.set(0.0, 1.0, 0.0);
        starsMaterial.color.setHex(0x00ff00);
        config.rotationSpeed = 0.002;
    } else {
        earthMaterial.color.setHex(0x88bbff);
        earthMaterial.emissive.setHex(0x001133);
        earthMaterial.specular.setHex(0x0044ff);
        earthMaterial.wireframe = false;
        clouds.visible = true;
        atmosphereMaterial.uniforms.glowColor.value.set(0.0, 0.6, 1.0);
        starsMaterial.color.setHex(0xffffff);
        config.rotationSpeed = 0.0003;
    }
};

// --- OS Mode Transition ---
window.startOSMode = () => {
    earthGroup.visible = false;
    moon.visible = false;
    starsMaterial.color.setHex(0xffffff);
    config.rotationSpeed = 0.0001;
}

// --- Moon ---
const moonGeometry = new THREE.SphereGeometry(0.27, 64, 64);
const moonMaterial = new THREE.MeshPhongMaterial({
    map: moonMap,
    bumpMap: moonMap,
    bumpScale: 0.002,
    shininess: 5,
});
const moon = new THREE.Mesh(moonGeometry, moonMaterial);
// Position Moon in background
moon.position.set(2, 1, -2);
scene.add(moon);

// --- ISS Station (Simplified Procedural) ---
const issGroup = new THREE.Group();
// Solar panels (thin boxes)
const solarPanelGeo = new THREE.BoxGeometry(0.6, 0.1, 0.02);
const solarPanelMat = new THREE.MeshStandardMaterial({ color: 0x334455, roughness: 0.4, metalness: 0.8 });
const solarL = new THREE.Mesh(solarPanelGeo, solarPanelMat);
solarL.position.x = -0.4;
const solarR = new THREE.Mesh(solarPanelGeo, solarPanelMat);
solarR.position.x = 0.4;
// Core modules (cylinders)
const moduleGeo = new THREE.CylinderGeometry(0.05, 0.05, 0.5, 8);
const moduleMat = new THREE.MeshStandardMaterial({ color: 0xcccccc, roughness: 0.5, metalness: 0.5 });
const core = new THREE.Mesh(moduleGeo, moduleMat);
core.rotation.z = Math.PI / 2;

issGroup.add(solarL, solarR, core);
// ISS is small relative to Earth
issGroup.scale.set(0.15, 0.15, 0.15);
earthGroup.add(issGroup); // Add to earth group to make orbit calculation easier relative to earth center

// --- Satellites (Tiny Dots/Boxes) ---
const satellites = [];
const satelliteGeo = new THREE.BoxGeometry(0.02, 0.01, 0.01);
const satelliteMat = new THREE.MeshBasicMaterial({ color: 0xffffff }); // Bright against space
for (let i = 0; i < 5; i++) {
    const sat = new THREE.Mesh(satelliteGeo, satelliteMat);
    earthGroup.add(sat);
    satellites.push({
        mesh: sat,
        radius: 1.3 + Math.random() * 0.3,
        speed: 0.001 + Math.random() * 0.002,
        angle: Math.random() * Math.PI * 2,
        inclination: (Math.random() - 0.5) * Math.PI // Random orbits
    });
}


// --- Starfield ---
const starsGeometry = new THREE.BufferGeometry();
const starPositionArray = new Float32Array(config.starCount * 3);
for (let i = 0; i < config.starCount * 3; i++) {
    starPositionArray[i] = (Math.random() - 0.5) * 80; // Wider field
}
starsGeometry.setAttribute('position', new THREE.BufferAttribute(starPositionArray, 3));
const starsMaterial = new THREE.PointsMaterial({
    size: config.starSize,
    color: 0xffffff,
    transparent: true,
    opacity: 0.9,
    sizeAttenuation: true,
});
const stars = new THREE.Points(starsGeometry, starsMaterial);
scene.add(stars);


// --- Resize Handler ---
window.addEventListener('resize', () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(window.devicePixelRatio);
});

// --- Animation Loop ---
// --- Animation Loop ---
let time = 0;
function animate() {
    requestAnimationFrame(animate);
    time += 1;

    // Earth Rotation
    earth.rotation.y += config.rotationSpeed;
    clouds.rotation.y += config.cloudSpeed;

    // Moon Orbit (Simple circular for visual effect)
    // Moon orbits Earth, but we also want it visible often. 
    // Let's make it slowly orbit background.
    const moonSpeed = 0.0001;
    moon.position.x = Math.cos(time * moonSpeed) * 3;
    moon.position.z = Math.sin(time * moonSpeed) * 3 - 2; // Keep it slightly behind/around
    moon.lookAt(earth.position); // Always face earth (approx tidal locking)

    // Moon Rotation
    moon.rotation.y += 0.002;

    // ISS Orbit
    // Orbiting close to Earth
    const issSpeed = 0.01; // Fast low earth orbit
    const issRadius = 1.15;
    issGroup.position.x = Math.cos(time * issSpeed) * issRadius;
    issGroup.position.z = Math.sin(time * issSpeed) * issRadius;
    issGroup.position.y = Math.sin(time * issSpeed * 0.5) * 0.5; // Inclination
    issGroup.lookAt(new THREE.Vector3(0, 0, 0)); // Solar panels face sun/center approx
    issGroup.rotateY(Math.PI / 2); // Align solar panels tangential

    // Satellites
    satellites.forEach(sat => {
        sat.angle += sat.speed;
        const x = Math.cos(sat.angle) * sat.radius;
        const z = Math.sin(sat.angle) * sat.radius;
        // Apply inclination
        const y = x * Math.sin(sat.inclination);
        const x_inc = x * Math.cos(sat.inclination);

        sat.mesh.position.set(x_inc, y, z);
        sat.mesh.lookAt(new THREE.Vector3(0, 0, 0));
    });

    // Stars rotation (Very slow)
    stars.rotation.y -= 0.0001;

    renderer.render(scene, camera);
}

animate();
