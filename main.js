import * as THREE from "three";
import { GLTFLoader } from "three/examples/jsm/Addons.js";
import TagHelper from "./src/util/TagHelper";
import GridView from "./src/util/GridView";
import MainControl from "./src/core/MainControl";
import SceneManagerSingleton from "./src/Manager/SceneManager";
import CanvasManagerSingleton from "./src/Manager/CanvasManager";
import ObjectSelector from "./src/core/ObjectSelector";
import { Loader } from "./src/core/Loader";
import { Menubar } from "./src/UI/menubar";
import { ObjectDataPanel } from "./src/UI/ObjectInfoPanel";
import { Viewport } from "./src/core/Viewport";
import { RectAreaLightHelper } from "three/examples/jsm/Addons.js";

const viewport = new Viewport();
document.body.appendChild(viewport.dom);

const menubar = new Menubar();
document.body.appendChild(menubar.dom);

const objectDataPanel = new ObjectDataPanel();
document.body.appendChild(objectDataPanel.objectPanel.dom);




// Scene
const sceneManager = SceneManagerSingleton.getInstance();
const scene = sceneManager.scene;
scene.background = new THREE.Color(0x000000);


// Renderer
const canvasManager = CanvasManagerSingleton.getInstance();
const renderer = canvasManager.renderer;
// Ambient Light
// const ambientLight = new THREE.AmbientLight(0xffffff, 2);
// scene.add(ambientLight);


// scene light
// const alight1 = new THREE.RectAreaLight(0xffffff, 2, 6, 2);
// alight1.lookAt(0, -1, 0)
// alight1.position.set(0, 2.5, 0)
// scene.add(alight1);


const pligt1 = new THREE.PointLight(0xffffff, 2);
pligt1.position.set(2.5, 2, 1.5)
scene.add(pligt1);

// const plight2 = new THREE.PointLight(0xffffff, 2);
// plight2.position.set(0, 2, 1.5);
// scene.add(plight2);

const plight3 = new THREE.PointLight(0xffffff, 2);
plight3.position.set(-2.5, 2, 1.5);
scene.add(plight3);

// const pligt4 = new THREE.PointLight(0xffffff, 2);
// pligt4.position.set(2.5, 2, -1.5)
// scene.add(pligt4);

// const plight5 = new THREE.PointLight(0xffffff, 2);
// plight5.position.set(0, 1.5, -1);
// scene.add(plight5);

const alight5 = new THREE.RectAreaLight(0xffffff, 1, 2, 4);
alight5.position.set(0, 1.5, -1);
alight5.lookAt(0, 0, -1)
scene.add(alight5);

const alight5h = new RectAreaLightHelper(alight5)
alight5.add(alight5h)


// const plight6 = new THREE.PointLight(0xffffff, 2);
// plight6.position.set(-2.5, 2, -1.5);
// scene.add(plight6);

// const rlHelper = new RectAreaLightHelper(plight1)
// plight1.add(rlHelper);





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
camera.position.x = 0
camera.position.y = 4.5
camera.position.z = 0;

// 0.9591308670267162, z: -2.704799149790561}
scene.add(camera);

//Control
const control = new MainControl(camera);
const objectSelector = new ObjectSelector(camera);
objectSelector.subscribe(objectDataPanel)

// Grid helper
const gridHelper = new GridView(50, 10);


const loader = new Loader();
loader.loadFromServer({fileUrl:"/api/model/bigRoom.glb", name: "Room"})



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
