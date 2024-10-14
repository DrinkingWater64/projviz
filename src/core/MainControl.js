import { OrbitControls } from "three/examples/jsm/Addons.js";
import * as THREE from "three"
import CanvasManagerSingleton from "../Manager/CanvasManager";

class MainControl extends OrbitControls {
  camera
  constructor(object) {
    super(object, CanvasManagerSingleton.getInstance().renderer.domElement)
    this.camera = object
    this.mouseButtons = {
      LEFT: THREE.MOUSE.NONE,    // Disable left mouse button
      MIDDLE: THREE.MOUSE.ROTATE, // Rotate with middle mouse button
      RIGHT: THREE.MOUSE.PAN    // Pan with right mouse button
    };


    const minPoint = new THREE.Vector3(-3.48, 0.32, -2.6)
    const maxPoint = new THREE.Vector3(3.20, 3.84, 2.45)

    this.addEventListener('change', () => {
      const cameraPosition = this.camera.position;

      cameraPosition.x = Math.max(minPoint.x, Math.min(maxPoint.x, cameraPosition.x));
      cameraPosition.y = Math.max(minPoint.y, Math.min(maxPoint.y, cameraPosition.y));
      cameraPosition.z = Math.max(minPoint.z, Math.min(maxPoint.z, cameraPosition.z));

      // this.update();
    })

  }
/*min
  Vector3
x
: 
-3.48521089553833
y
: 
0.3256375789642334
z
: 
-2.610181748867035
*/


/*
max
: 
_Vector3
x
: 
3.200439929962158
y
: 
3.8424854278564453
z
: 
2.4574186205863953
*/

  SetCamBound(box) {
    const minPoint = box.min;
    const maxPoint = box.max;
    
    this.addEventListener('change', () => {
      const cameraPosition = this.camera.position;

      cameraPosition.x = Math.max(minPoint.x, Math.min(maxPoint.x, cameraPosition.x));
      cameraPosition.y = Math.max(minPoint.y, Math.min(maxPoint.y, cameraPosition.y));
      cameraPosition.z = Math.max(minPoint.z, Math.min(maxPoint.z, cameraPosition.z));

      this.update();
    })
  }
}

export default MainControl