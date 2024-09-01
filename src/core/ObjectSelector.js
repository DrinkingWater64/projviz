import { Raycaster, Vector2 } from "three"
import TagHelper from "../util/TagHelper"
import TransformGizmo from "./TransformGizmo"

class ObjectSelector {
  #isMouseDragging
  #isMouseDown
  #mousePos
  #camera
  #raycaster
  #tagHelper
  #transformControl
  constructor(camera) {
    this.#camera = camera
    this.#isMouseDragging = false
    this.#isMouseDown = false
    this.#mousePos = new Vector2()
    this.#raycaster = new Raycaster()
    this.#tagHelper = new TagHelper("box")
    this.#transformControl = new TransformGizmo(this.#camera)
  }

  HandleOnClick(event) {
    if(this.isMouseDragging) {
      return
    }

    this.#mousePos.x = (event.clientX / window.innerWidth) * 2 - 1;
    this.#mousePos.y = -(event.clientY / window.innerHeight) * 2 + 1;

    this.raycaster.setFromCamera(this.mousePos, this.camera);
    const intersects = this.#raycaster.intersectObjects(SceneManagerSingleton.getInstance().scene.children);
    const filteredObjects = this.#tagHelper.FindObjectsWithTag(intersects);

    if (filteredObjects.length > 0) {
      const selectedObject = filteredObjects[0];
      if (
        selectedObject.object instanceof THREE.Mesh &&
        (selectedObject.object.tag == this.tagHelper.tag ||
          selectedObject.object.parent.tag == this.tagHelper.tag)
      ) {
        this.#transformControl.attach(selectedObject.object);
      }
    }
  }
}

export default ObjectSelector