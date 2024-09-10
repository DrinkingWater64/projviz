import { WebGLRenderer, PCFSoftShadowMap } from "three";

class CanvasManager {
  renderer;
  constructor() {
    this.renderer = new WebGLRenderer({antialias: true});
    this.renderer.shadowMap.enabled = true;
    // this.renderer.shadowMap.type = PCFSoftShadowMap;
    this.renderer.setPixelRatio(window.devicePixelRatio);
    this.renderer.setSize(window.innerWidth, window.innerHeight);
    document.body.appendChild(this.renderer.domElement);
  }


  get renderer(){
    return this.renderer
  }
}

const CanvasManagerSingleton = (() => {
  let instance

  return {
    getInstance: () => {
      if(!instance) {
        instance = new CanvasManager()
      }
      return instance
    }
  }
})();

export default CanvasManagerSingleton