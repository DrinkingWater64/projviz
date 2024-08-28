import * as THREE from "three";
import {
  GLTFLoader,
  OrbitControls,
  TransformControls,
  SelectionBox,
  SelectionHelper,
} from "three/examples/jsm/Addons.js";
import DebugDraw from "./src/Debug/DebugDraw";
import TagHelper from "./src/util/TagHelper";
import TransformGizmo from "./src/core/TransformGizmo";
import GridView from "./src/util/GridView";
import MainControl from "./src/core/MainControl";

// States
let isSelecting = false;
let MultiSelectMode = true;

// Mesh Highlight
let highlightMat = new THREE.MeshBasicMaterial({ color: 0x00ff00 });
let matBackup = new Map();
let lastSelectedObject = undefined;

// Scene
const scene = new THREE.Scene();
scene.background = new THREE.Color(0xbfe3dd);

// Ambient Light
const ambientLight = new THREE.AmbientLight(0xffffff, 1);
scene.add(ambientLight);

// test box
const boxGeoemetry = new THREE.BoxGeometry(1, 1, 1);
const boxmaterial = new THREE.MeshBasicMaterial();
const box = new THREE.Mesh(boxGeoemetry, boxmaterial);
box.tag = "box";
box.translateX(3);

scene.add(box);

// Group selection group
// let group = new THREE.Group();

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
// const control = new OrbitControls(camera, renderer.domElement);
const control = new MainControl(camera, renderer.domElement);

// Initialize TransformControls and add to the scene
// const transformControl = new TransformControls(camera, renderer.domElement);
const transformControl = new TransformGizmo(camera, renderer.domElement);
scene.add(transformControl);

// Initialize SelectionBox and SelectionHelper
const selectionBox = new SelectionBox(camera, scene);
let selectionHelper = new SelectionHelper(renderer, "selectBox");
selectionHelper.dispose();
// new SelectionHelper(renderer, "selectBox");

// Mouse down event to start selection

//Mouse control
const raycaster = new THREE.Raycaster();
const mouse = new THREE.Vector2();

// Mouse states
let isDragging = false;
let mouseDown = false;

window.addEventListener("mousedown", (event) => {
  if (event.button === 0 && transformControl.axis === null) {
    mouseDown = true;
    isDragging = false;

    // if (MultiSelectMode) {
    //   selectionHelper = new SelectionHelper(renderer, "selectBox");
    // }

    if (MultiSelectMode) {
      // ClearGroup(group);

      selectionHelper.onPointerDown(event);

      isSelecting = true;
      // control.enabled = false;
      // transformControl.detach(); // Detach any currently attached object
      selectionBox.startPoint.set(
        (event.clientX / window.innerWidth) * 2 - 1,
        -(event.clientY / window.innerHeight) * 2 + 1,
        0.5
      );
    }
  }
});

// Mouse move event to update selection box
window.addEventListener("mousemove", (event) => {
  HighlightMesh(event);
  if (mouseDown) {
    isDragging = true; // Set dragging to true if the mouse moves while pressed
  }

  if (MultiSelectMode) {
    if (isSelecting) {
      selectionHelper.onPointerMove(event);
      selectionBox.endPoint.set(
        (event.clientX / window.innerWidth) * 2 - 1,
        -(event.clientY / window.innerHeight) * 2 + 1,
        0.5
      );
      selectionBox.select(); // Select objects within the box
    }
  }
});

// Mouse up event to finalize selection and attach TransformControls
window.addEventListener("mouseup", () => {
  mouseDown = false;

  if (MultiSelectMode) {
    selectionHelper.onPointerUp();
    // isSelecting = false;
    const selectedObjects = selectionBox.select(); // Get selected objects
    let group = new THREE.Group();
    let groupPos = new THREE.Vector3(0, 0, 0);

    selectedObjects.forEach((object) => {
      if (object.parent && object.parent.tag === "helper") return;
      if (object.parent && object.tag === "helper") return;

      if (
        object instanceof THREE.Mesh &&
        (object.tag == "box" || object.parent.tag == "box")
      ) {
        AddMeshToGroup(group, object);
        groupPos.add(object.position);
      }
    });

    let groupLen = group.children.length;
    if (groupLen > 0) {
      groupPos = new THREE.Vector3(
        groupPos.x / groupLen,
        groupPos.y / groupLen,
        groupPos.z / groupLen
      );
      group.position.copy(groupPos);
      console.log(groupPos);

      scene.add(group);
      transformControl.attach(group);
      // control.enabled = false;
    } else {
      scene.remove(group);
      // transformControl.detach();
      // control.enabled = true;
    }
  }
});

// single object select %%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%

window.addEventListener("click", () => {
  if (isDragging) {
    return;
  }

  mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
  mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;

  raycaster.setFromCamera(mouse, camera);
  const intersects = raycaster.intersectObjects(scene.children);

  //7777777777777777777777777777777777777777777777777777777777777777777777777777777777777777777777777777    draw debug     7777777777777777777777777777777777777777777777777777777777777777777777777777777777777777777777777777
  // const debugdraw = new DebugDraw(100, 0x00ff00, .1)
  // debugdraw.DrawLine(raycaster, scene)
  // debugdraw.DrawImpact(raycaster, scene)
  //7777777777777777777777777777777777777777777777777777777777777777777777777777777777777777777777777777    draw debug     7777777777777777777777777777777777777777777777777777777777777777777777777777777777777777777777777777

  const filteredObjects = boxTag.FindObjectsWithTag(intersects);
  if (filteredObjects.length > 0) {
    const selectedObject = filteredObjects[0];
    if (
      selectedObject.object instanceof THREE.Mesh &&
      (selectedObject.object.tag == "box" ||
        selectedObject.object.parent.tag == "box")
    ) {
      transformControl.attach(selectedObject.object);
      // control.enabled = false;
    }
  } else {
    transformControl.detach();
    // control.enabled = true;
  }
});

// keyboard control...........................................................................................................................................
window.addEventListener("keypress", (event) => {
  // console.log(event);
  if (event.key === "`") {
    transformControl.detach();
    control.enabled = true;
  }
});

window.addEventListener("keypress", (event) => {
  if (event.key === "1") {
    MultiSelectMode = !MultiSelectMode;
  }
});

// Grid helper

const gridHelper = new GridView(scene, 50, 10);

// Load model
const boxTag = new TagHelper("box");

const loader = new GLTFLoader();
const LoadModel = (path, gLTFLoader) => {
  gLTFLoader.load(path, (gltf) => {
    boxTag.AddTag(gltf.scene);
    scene.add(gltf.scene);
  });
};
LoadModel("https://localhost:7133/api/Model/scene.gltf", loader);

// Function calls------------------------------------------------------------------------------------------------------------------------

const animate = () => {
  requestAnimationFrame(animate);
  control.update();
  renderer.render(scene, camera);
};
animate();

/**
 * Adds meshes to group with defined conditions in it.
 * @param {THREE.Group} group
 * @param {THREE.Mesh} mesh
 */
const AddMeshToGroup = (group, mesh) => {
  group.children.forEach((child) => {
    if (child === mesh) {
      return;
    }
  });
  group.add(mesh);
};

const HighlightMesh = (event) => {
  if(transformControl.object){
    return
  }



  mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
  mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;

  raycaster.setFromCamera(mouse, camera);
  const intersects = raycaster.intersectObjects(scene.children);

  const filteredObjects = boxTag.FindObjectsWithTag(intersects);
  if (filteredObjects.length > 0) {
    const selectedObject = filteredObjects[0];

    if (
      selectedObject.object instanceof THREE.Mesh &&
      (selectedObject.object.tag == "box" ||
        selectedObject.object.parent.tag == "box")
    ) {
      // console.log(selectedObject.object.uuid)
      if (lastSelectedObject != selectedObject.object && lastSelectedObject != undefined) {
        lastSelectedObject.material = matBackup.get(lastSelectedObject.uuid);
      }
      lastSelectedObject = selectedObject.object;

      if (matBackup.has(selectedObject.object.uuid)) {
        selectedObject.object.material = highlightMat;
      } else {
        matBackup.set(
          selectedObject.object.uuid,
          selectedObject.object.material
        );
        selectedObject.object.material = highlightMat;
      }
    }
  } else if (lastSelectedObject != undefined){
    lastSelectedObject.material = matBackup.get(lastSelectedObject.uuid);
  }
};

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
  LoadModel("https://localhost:7133/api/Model/" + name + ".gltf", loader);
};

window.LMC = LMC;
