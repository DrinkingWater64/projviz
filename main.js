import * as THREE from "three";
import { GLTFLoader, Wireframe } from "three/examples/jsm/Addons.js";
import {
  OrbitControls,
  TransformControls,
  SelectionBox,
  SelectionHelper,
} from "three/examples/jsm/Addons.js";
import {} from "three/examples/jsm/Addons.js";

// Scene
const scene = new THREE.Scene();
scene.background = new THREE.Color(0xbfe3dd);

const boxGeoemetry = new THREE.BoxGeometry(0.1, 0.1, 0.1);
const boxmaterial = new THREE.MeshBasicMaterial();
const box = new THREE.Mesh(boxGeoemetry, boxmaterial);
box.tag = "box";

scene.add(box);

// Group selection group
const group = new THREE.Group();

//camera

const camera = new THREE.PerspectiveCamera(
  45,
  window.innerWidth / window.innerHeight,
  0.1,
  1000
);
camera.position.z = 3;
scene.add(camera);

// Canvas
const canvas = document.querySelector("canvas.webgl");

// Renderer
const renderer = new THREE.WebGLRenderer({
  canvas: canvas,
});
renderer.setPixelRatio(window.devicePixelRatio);
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

//Control
const control = new OrbitControls(camera, renderer.domElement);

// Initialize TransformControls and add to the scene
const transformControl = new TransformControls(camera, renderer.domElement);
scene.add(transformControl);

// Initialize SelectionBox and SelectionHelper
const selectionBox = new SelectionBox(camera, scene);
const selectionHelper = new SelectionHelper(renderer, "selectBox");



//States
let isSelecting = false;
let MultiSelectMode = false;

// Mouse down event to start selection
window.addEventListener("mousedown", (event) => {
  if (!MultiSelectMode) {
    return;
  }

  isSelecting = true;
  transformControl.detach(); // Detach any currently attached object
  selectionBox.startPoint.set(
    (event.clientX / window.innerWidth) * 2 - 1,
    -(event.clientY / window.innerHeight) * 2 + 1,
    0.5
  );

  selectionHelper.onPointerDown(event);
});

// Mouse move event to update selection box
window.addEventListener("mousemove", (event) => {
  if (!MultiSelectMode) {
    return;
  }
  if (isSelecting) {
    selectionBox.endPoint.set(
      (event.clientX / window.innerWidth) * 2 - 1,
      -(event.clientY / window.innerHeight) * 2 + 1,
      0.5
    );
    selectionBox.select(); // Select objects within the box
  }

  selectionHelper.onPointerMove(event);
});

// Mouse up event to finalize selection and attach TransformControls
window.addEventListener("mouseup", () => {
  if (!MultiSelectMode) {
    return;
  }

  isSelecting = false;
  const selectedObjects = selectionBox.select(); // Get selected objects

  selectedObjects.forEach((object) => {
    if (object.parent && object.parent.tag === "helper") return;
    if (object.parent && object.tag === "helper") return;

    if (
      object instanceof THREE.Mesh &&
      (object.tag == "box" || object.parent.tag == "box")
    ) {
      // object.material = new THREE.MeshBasicMaterial({ wireframe: true });
      // transformControl.attach(object);
      AddMeshToGroup(group, object)
    }
  });
  scene.add(group);
  transformControl.attach(group);
  // selectionHelper.onPointerUp()
});

//Mouse control
const raycaster = new THREE.Raycaster();
const mouse = new THREE.Vector2();

window.addEventListener("click", () => {
  if(MultiSelectMode){
    return
  }

  mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
  mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;

  raycaster.setFromCamera(mouse, camera);

  const intersects = raycaster.intersectObjects(scene.children);

  if (intersects.length > 0) {
    const selectedObject = intersects[0];
    console.log(selectedObject.object.tag);
    if (selectedObject.object instanceof THREE.Mesh) {
      transformControl.attach(selectedObject.object);
      control.enabled = false;
    }
  }
});

// keyboard control
window.addEventListener("keypress", (event) => {
  console.log(event);
  if (event.key === "`") {
    transformControl.detach();
    control.enabled = true;
  }
});


window.addEventListener("keypress", (event) => {
  console.log(event);
  if (event.key === "1") {
    MultiSelectMode = !MultiSelectMode
  }
});


// Grid helper
// const gridSize = 100
// const gridDivision = 100
// const gridHelper = new THREE.GridHelper(gridSize, gridDivision)
// scene.add(gridHelper)

// Load model
const loader = new GLTFLoader();
loader.load("https://localhost:7133/api/Model/scene.gltf", (gltf) => {
  AddTagToMesh(gltf.scene, "box");
  console.log(gltf);
  scene.add(gltf.scene);
  // transformControl.attach(gltf.scene)
});

// Function calls

const animate = () => {
  requestAnimationFrame(animate);
  control.update();
  renderer.render(scene, camera);
};
animate();

const AddTagToMesh = (object, tag) => {
  object.tag = tag;
  object.children.forEach((child) => {
    AddTagToMesh(child, tag);
  });
};

const AddMeshToGroup = (group, mesh) => {
  group.children.forEach((child) =>{
    if (child === mesh) {
      return
    }
  })
  group.add(mesh)
}

// Resize event listener
export function onWindowResize() {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  renderer.render(scene, camera);
}
window.addEventListener("resize", onWindowResize);
