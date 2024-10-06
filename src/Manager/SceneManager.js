import { Scene } from "three";

class SceneManager {
  _scene
  cameraBoundBox
  constructor() {
    this._scene = new Scene()
    this.cameraBoundBox = null
  }

  set cameraBoundBox(box){}
  
  get scene() {
    return this._scene
  }
}

const SceneManagerSingleton = (() => {
  let instance;

  return {
    getInstance: () => {
      if(!instance) {
        instance = new SceneManager()
      }
      return instance
    }
  }
})();

export default SceneManagerSingleton