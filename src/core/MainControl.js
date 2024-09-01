import { OrbitControls } from "three/examples/jsm/Addons.js";
import * as THREE from "three"
import CanvasManagerSingleton from "../Manager/CanvasManager";

class MainControl extends OrbitControls {
  constructor(object) {
    super(object, CanvasManagerSingleton.getInstance().renderer.domElement)
    this.mouseButtons = {
      LEFT: THREE.MOUSE.NONE,    // Disable left mouse button
      MIDDLE: THREE.MOUSE.ROTATE, // Rotate with middle mouse button
      RIGHT: THREE.MOUSE.PAN    // Pan with right mouse button
    };
  }
}

export default MainControl