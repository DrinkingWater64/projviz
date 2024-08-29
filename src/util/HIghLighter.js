import { Raycaster, Vector2, Mesh, MeshBasicMaterial } from "three"
import TagHelper from "./TagHelper"

class Highlighter {
  lastSelectedObject
  materialMap
  mousePos
  raycaster
  camera
  tagHelper
  highlightMat

  constructor(scene, camera) {
    this.materialMap = new Map()
    this.lastSelectedObject = undefined
    this.mousePos = new Vector2()
    this.raycaster = new Raycaster()
    this.scene = scene
    this.camera = camera
    this.tagHelper = new TagHelper("box")
    this.highlightMat = new MeshBasicMaterial({ color: 0xffa500 })
  }

  HighlightMesh (event) {
    this.mousePos.x = (event.clientX / window.innerWidth) * 2 - 1;
    this.mousePos.y = -(event.clientY / window.innerHeight) * 2 + 1;

    this.raycaster.setFromCamera(this.mousePos, this.camera)

    const intersects = this.raycaster.intersectObjects(this.scene.children)
    const filteredObjects = this.tagHelper.FindObjectsWithTag(intersects)

    if (filteredObjects.length > 0) {
      const selectedObject = filteredObjects[0];
  
      if (
        selectedObject.object instanceof Mesh &&
        (selectedObject.object.tag == "box" ||
          selectedObject.object.parent.tag == "box")
      ) {
        if (
          this.lastSelectedObject != selectedObject.object &&
          this.lastSelectedObject != undefined
        ) {
          this.lastSelectedObject.material = this.materialMap.get(this.lastSelectedObject.uuid);
        }
        this.lastSelectedObject = selectedObject.object;
  
        if (this.materialMap.has(selectedObject.object.uuid)) {
          selectedObject.object.material = this.highlightMat;
        } else {
          this.materialMap.set(
            selectedObject.object.uuid,
            selectedObject.object.material
          );
          selectedObject.object.material = this.highlightMat;
        }
      }
    } else if (this.lastSelectedObject != undefined) {
      this.lastSelectedObject.material = this.materialMap.get(this.lastSelectedObject.uuid);
    }
  }
}

export default Highlighter;