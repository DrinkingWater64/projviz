import { TransformControls } from "three/examples/jsm/Addons.js";
import CanvasManagerSingleton from "../Manager/CanvasManager";
class TransformGizmo extends TransformControls {
  constructor(camera) {
    super(camera, CanvasManagerSingleton.getInstance().renderer.domElement);
    window.addEventListener("keypress", this.switchModes.bind(this))
  }

  switchModes(event) {
    switch (event.key) {
      case "w":
        this.setMode("translate");
        break;
      case "e":
        this.setMode("rotate");
        break;
      case "r":
        // this.setMode("scale");
        this.setMode("scale");
        break;
    }
  }
}

export default TransformGizmo;
