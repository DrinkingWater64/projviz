import * as THREE from "three";
import { GLTFLoader } from "three/examples/jsm/Addons.js";
import DebugDraw from "./src/Debug/DebugDraw";
import TagHelper from "./src/util/TagHelper";
import TransformGizmo from "./src/core/TransformGizmo";
import GridView from "./src/util/GridView";
import MainControl from "./src/core/MainControl";
import Highlighter from "./src/util/HighLighter";
import SceneManagerSingleton from "./src/Manager/SceneManager";
import CanvasManagerSingleton from "./src/Manager/CanvasManager";
import ObjectSelector from "./src/core/ObjectSelector";

// States
let isSelecting = false;
let MultiSelectMode = true;

// Scene
const sceneManager = SceneManagerSingleton.getInstance();
// const scene = new THREE.Scene();
const scene = sceneManager.scene;
scene.background = new THREE.Color(0xbfe3dd);
// Canvas
const canvas = document.querySelector("canvas.webgl");

// Renderer
const canvasManager = CanvasManagerSingleton.getInstance();

const renderer = canvasManager.renderer;
// Ambient Light
// const ambientLight = new THREE.AmbientLight(0xffffff, 0.1);
// scene.add(ambientLight);

const light = new THREE.DirectionalLight(0xffffff, 1);
light.position.set(10, 10, 10);
// light.castShadow = true;
scene.add(light);
// light.shadow.normalBias = 0.05;
// light.shadow.bias = -0.00001;
// light.shadow.mapSize.width = 2048;
// light.shadow.mapSize.height = 2048;
// light.shadow.camera.left = -70;
// light.shadow.camera.right = 70;
// light.shadow.camera.top = 70;
// light.shadow.camera.bottom = -70;
// light.shadow.camera.near = 0.5;
// light.shadow.camera.far = 500;

const helper = new THREE.DirectionalLightHelper(light, 5);
scene.add(helper);


//camera
const camera = new THREE.PerspectiveCamera(
  45,
  window.innerWidth / window.innerHeight,
  0.1,
  1000
);
camera.near = 0.01;
camera.far = 2000;
camera.updateProjectionMatrix();
camera.position.z = 10;
scene.add(camera);

//Control
const control = new MainControl(camera);
const objectSelector = new ObjectSelector(camera);

// Grid helper
const gridHelper = new GridView(50, 10);

// Load model
const boxTag = new TagHelper("box");

const loader = new GLTFLoader();
const LoadModel = (path, gLTFLoader) => {
  gLTFLoader.load(path, (gltf) => {
    boxTag.AddTag(gltf.scene);
    gltf.scene.castShadow = true;
    gltf.scene.receiveShadow = true;
    gltf.scene.traverse((child) => {
      child.castShadow = true;
      child.receiveShadow = true;
    });
    scene.add(gltf.scene);
  });
};
LoadModel("https://localhost:7133/api/Model/roomBaked.glb", loader);

// Function calls------------------------------------------------------------------------------------------------------------------------

const animate = () => {
  requestAnimationFrame(animate);
  control.update();
  renderer.render(scene, camera);
};
animate();

// Resize event listener---------------------------------------------------------------------------------------------------------------
export function onWindowResize() {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  renderer.render(scene, camera);
}
window.addEventListener("resize", onWindowResize);

/**
 * Loads model in console
 * @param {Strin} name
 */
export const LMC = (name) => {
  LoadModel("https://localhost:7133/api/Model/" + name + ".glb", loader);
};

window.LMC = LMC;
