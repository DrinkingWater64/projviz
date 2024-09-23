import { Raycaster, Vector2, Mesh, Group, Vector3 } from "three";
import TagHelper from "../util/TagHelper";
import TransformGizmo from "./TransformGizmo";
import { SelectionBox, SelectionHelper } from "three/examples/jsm/Addons.js";
import SceneManagerSingleton from "../Manager/SceneManager";
import CanvasManagerSingleton from "../Manager/CanvasManager";
import Highlighter from "../util/HighLighter";
class ObjectSelector {
  #canGroupSelect;
  #isMouseDragging;
  #isMouseDown;
  #mousePos;
  #camera;
  #raycaster;
  #tagHelper;
  #transformControl;
  #selectionBox;
  #selectionHelper;
  #highlighter;
  selectedObject;
  #observers;
  constructor(camera) {
    this.#canGroupSelect = false;
    this.#camera = camera;
    this.#isMouseDragging = false;
    this.#isMouseDown = false;
    this.#mousePos = new Vector2();
    this.#raycaster = new Raycaster();
    this.#tagHelper = new TagHelper("box");
    this.#transformControl = new TransformGizmo(this.#camera);
    SceneManagerSingleton.getInstance().scene.add(this.#transformControl);
    this.#selectionBox = new SelectionBox(
      this.#camera,
      SceneManagerSingleton.getInstance().scene
    );
    this.#selectionHelper = new SelectionHelper(
      CanvasManagerSingleton.getInstance().renderer,
      "selectBox"
    );
    this / this.#selectionHelper.dispose();
    this.#highlighter = new Highlighter(this.#camera);

    this.#observers = [];

    window.addEventListener("mousedown", (event) => {
      this.HandleOnMouseDown(event);
    });

    window.addEventListener("mousemove", (event) => {
      this.HandleMouseMove(event);
    });

    window.addEventListener("mouseup", (event) => {
      this.HandleMouseUp(event);
    });

    window.addEventListener("click", (event) => {
      this.HandleOnClick(event);
    });
  }

  HandleOnMouseDown(event) {
    this.#isMouseDown = true;
    this.#isMouseDragging = false;

    if (
      this.#canGroupSelect &&
      event.button === 0 &&
      this.#transformControl.axis === null
    ) {
      console.log(event.button);
      this.#isMouseDown = true;
      this.#isMouseDragging = false;
      this.#selectionHelper.onPointerDown(event);
      this.#selectionBox.startPoint.set(
        (event.clientX / window.innerWidth) * 2 - 1,
        -(event.clientY / window.innerHeight) * 2 + 1,
        0.5
      );
    }
  }

  HandleMouseMove(event) {
    this.#highlighter.HighlightMesh(event);
    if (this.#isMouseDown) {
      this.#isMouseDragging = true;
      this.notify();
    }

    if (this.#canGroupSelect) {
      this.#selectionHelper.onPointerMove(event);
      this.#selectionBox.endPoint.set(
        (event.clientX / window.innerWidth) * 2 - 1,
        -(event.clientY / window.innerHeight) * 2 + 1,
        0.5
      );

      this.#selectionBox.select();
    }
  }

  HandleMouseUp(event) {
    this.#isMouseDown = false;

    if (this.#canGroupSelect) {
      this.#selectionHelper.onPointerUp();
      const selectedObjects = this.#selectionBox.select(); // Get selected objects
      let group = new Group();
      let groupPos = new Vector3(0, 0, 0);

      selectedObjects.forEach((object) => {
        if (object.parent && object.parent.tag === "helper") return;
        if (object.parent && object.tag === "helper") return;

        if (
          object instanceof Mesh &&
          (object.tag == "box" || object.parent.tag == "box")
        ) {
          group.add(object);
          groupPos.add(object.position);
        }
      });

      let groupLen = group.children.length;
      if (groupLen > 0) {
        groupPos = new Vector3(
          groupPos.x / groupLen,
          groupPos.y / groupLen,
          groupPos.z / groupLen
        );
        group.position.copy(groupPos);
        console.log(groupPos);

        SceneManagerSingleton.getInstance().scene.add(group);
        this.#transformControl.attach(group);
        // control.enabled = false;
      } else {
        SceneManagerSingleton.getInstance().scene.remove(group);
        this.#transformControl.detach();
        // control.enabled = true;
      }
    }
  }

  HandleOnClick(event) {
    if (this.#isMouseDragging) {
      return;
    }

    this.#mousePos.x = (event.clientX / window.innerWidth) * 2 - 1;
    this.#mousePos.y = -(event.clientY / window.innerHeight) * 2 + 1;

    this.#raycaster.setFromCamera(this.#mousePos, this.#camera);
    const intersects = this.#raycaster.intersectObjects(
      SceneManagerSingleton.getInstance().scene.children
    );
    const filteredObjects = this.#tagHelper.FindObjectsWithTag(intersects);

    if (filteredObjects.length > 0) {
      const selectedObject = filteredObjects[0];
      this.SelectObject(selectedObject);
    } else {
      this.DeselectObject();
    }
  }

  SelectObject(selectedObject) {
    if (
      selectedObject.object instanceof Mesh &&
      (selectedObject.object.tag == this.#tagHelper.tag ||
        selectedObject.object.parent.tag == this.#tagHelper.tag)
    ) {
      this.selectedObject = selectedObject;
      this.#transformControl.attach(selectedObject.object);
      this.notify();
    } else {
      this.DeselectObject();
    }
  }

  DeselectObject() {
    this.#transformControl.detach();
    this.selectedObject = null;
    this.notify();
  }

  notify() {
    this.#observers.forEach((observer) => {
      if (this.selectedObject !== null) {
        observer.Update(this.selectedObject);
      } else {
        observer.Hide();
      }
    });
  }

  subscribe(o) {
    this.#observers.push(o);
  }

  unsubscribe(o) {
    [...this.#observers].forEach((observer, index) => {
      if (observer === o) {
        this.#observers.splice(index, 1);
      }
    });
  }
}

export default ObjectSelector;
