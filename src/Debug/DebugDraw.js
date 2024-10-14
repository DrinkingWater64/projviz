import * as THREE from "three";
import SceneManagerSingleton from "../Manager/SceneManager";

class DebugDraw {
  #length
  #color
  #radius
  #widthSegment
  #heightSegment

  constructor(length, color, radius) {
    this.#length = length
    this.#color = new THREE.Color(color)
    this.#radius = radius
    this.#widthSegment = 16
    this.#heightSegment = 16
    
  }

  DrawLine(raycaster) {
    const origin = raycaster.ray.origin
    const direction = raycaster.ray.direction.clone().normalize().multiplyScalar(this.#length);
    
    const geometry = new THREE.BufferGeometry().setFromPoints([origin, origin.clone().add(direction)])
    const material = new THREE.LineBasicMaterial({color: this.#color})
    const rayLine = new THREE.Line(geometry, material)
    SceneManagerSingleton.getInstance().scene.add(rayLine)
    // console.log("draw")
  }

  DrawImpact(raycaster){
    const intersects = raycaster.intersectObjects(scene.children)
    const intersectPoint = intersects[0].point;
    const sphereGeometry = new THREE.SphereGeometry(this.#radius, 16, 16);
    const sphereMaterial = new THREE.MeshBasicMaterial({ color: 0x00ff00 });
    const intersectionSphere = new THREE.Mesh(sphereGeometry, sphereMaterial);
    intersectionSphere.position.copy(intersectPoint);
    SceneManagerSingleton.getInstance().scene.add(intersectionSphere);
  }
}

export default DebugDraw;