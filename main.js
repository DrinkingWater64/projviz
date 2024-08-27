import * as THREE from "three";
import {
  OrbitControls,
  TransformControls,
  SelectionBox,
  SelectionHelper,
} from "three/examples/jsm/Addons.js";
import DebugDraw from "./src/Debug/DebugDraw";



// States
let isSelecting = false;
let MultiSelectMode = false;
// Scene
const scene = new THREE.Scene();
scene.background = new THREE.Color(0xbfe3dd);


// Ambient Light
const ambientLight = new THREE.AmbientLight(0xffffff, 1)
scene.add(ambientLight)



// test box
const boxGeoemetry = new THREE.BoxGeometry(1, 1, 1);
const boxmaterial = new THREE.MeshBasicMaterial();
const box = new THREE.Mesh(boxGeoemetry, boxmaterial);
box.tag = "box";
box.translateX(3);

scene.add(box);

// Group selection group
let group = new THREE.Group();

//camera

const camera = new THREE.PerspectiveCamera(
  45,
  window.innerWidth / window.innerHeight,
  0.1,
  1000
);
camera.near = .01
camera.far = 2000
camera.updateProjectionMatrix()
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
const control = new OrbitControls(camera, renderer.domElement);

// Initialize TransformControls and add to the scene
const transformControl = new TransformControls(camera, renderer.domElement);
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

  mouseDown = true;
  isDragging = false;


  // if (MultiSelectMode) {
  //   selectionHelper = new SelectionHelper(renderer, "selectBox");
  // }

  if (MultiSelectMode) {

    ClearGroup(group);


    selectionHelper.onPointerDown(event)


    isSelecting = true;
    control.enabled = false;
    transformControl.detach(); // Detach any currently attached object
    selectionBox.startPoint.set(
      (event.clientX / window.innerWidth) * 2 - 1,
      -(event.clientY / window.innerHeight) * 2 + 1,
      0.5
    );


  }

  // selectionHelper.onPointerDown(event);
});

// Mouse move event to update selection box
window.addEventListener("mousemove", (event) => {

  if (mouseDown) {
    isDragging = true; // Set dragging to true if the mouse moves while pressed
  }



  if (MultiSelectMode) {
    if (isSelecting) {
      selectionHelper.onPointerMove(event)
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

  mouseDown = false


  if (MultiSelectMode ) {
    selectionHelper.onPointerUp();
    control.enabled = true
    isSelecting = false;
    const selectedObjects = selectionBox.select(); // Get selected objects

    selectedObjects.forEach((object) => {
      if (object.parent && object.parent.tag === "helper") return;
      if (object.parent && object.tag === "helper") return;

      if (
        object instanceof THREE.Mesh &&
        (object.tag == "box" || object.parent.tag == "box")
      ) {
        AddMeshToGroup(group, object);
      }
    });
    if (group.children.length > 0) {
      scene.add(group);
      transformControl.attach(group);
      control.enabled = false;
    }else{
      scene.remove(group);
      transformControl.detach();
      control.enabled = true;
    }

    


  }
});

// single object select %%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%

window.addEventListener("click", () => {
  if (MultiSelectMode || isDragging) {
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



  const filteredObjects = FindObjectWithTag(intersects, "box")
  if (filteredObjects.length > 0) {
    const selectedObject = filteredObjects[0];
    if (
      selectedObject.object instanceof THREE.Mesh &&
      (selectedObject.object.tag == "box" ||
        selectedObject.object.parent.tag == "box")
    ) {
      transformControl.attach(selectedObject.object);
      control.enabled = false;
    }
  } else {
    transformControl.detach();
    control.enabled = true;
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

window.addEventListener("keypress", (event) => {
  
  switch(event.key) {
    case 'w':
      transformControl.setMode('translate');
      break;
    case 'e':
      transformControl.setMode('rotate');
      break;
    case 'r':
      transformControl.setMode('scale');
      break;
    case 'g':
      gridHelper.visible = !gridHelper.visible;

  }
});

// DDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDD--- Debug key ---DDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDD
window.addEventListener("keypress", (event) => {
  if (event.key === "c") {
    console.log(scene.children);
  }
});



// Grid helper
const gridSize = 100
const gridDivision = 100
const gridHelper = new THREE.GridHelper(gridSize, gridDivision)
scene.add(gridHelper)

// Load model
// const loader = new GLTFLoader();
// const LoadModel = (path, gLTFLoader) => {
//   gLTFLoader.load(path, (gltf) => {
//     console.log(gltf)
//     AddTagToMesh(gltf.scene, "box");
//     scene.add(gltf.scene);
//   })
// }
// LoadModel("https://localhost:7133/api/Model/TestRoom.glb", loader);



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


/**
 * Empties the group and add the children back to the scene
 * @param {THREE.Group} group 
 */
const ClearGroup = (group) => {

  while(group.children.length > 0) {
    const child = group.children[0];
    group.remove(child);
    scene.add(child);
  }
  group = new THREE.Group();
}

/**
 * Takes a list of object and finds the object with specified tags
 * @param {Array} objects 
 * @param {String} tag 
 * @returns 
 */
const FindObjectWithTag = (objects, tag) => {
  const fileteredObjects = objects.filter(object => object.object.tag===tag)
  return fileteredObjects;
}

/**
 * Adds tag to a object
 * @param {*} object 
 * @param {String} tag 
 */
const AddTagToMesh = (object, tag) => {
  object.tag = tag;
  object.children.forEach((child) => {
    AddTagToMesh(child, tag);
  });
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
  LoadModel("https://localhost:7133/api/Model/"+name+".gltf", loader)
};

window.LMC = LMC