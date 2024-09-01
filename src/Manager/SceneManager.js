import { Scene } from "three";

class SceneManager {
  scene
  constructor() {
    this.scene = new Scene()
  }

  get scene() {
    return this.scene
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