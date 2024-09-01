import { GridHelper } from "three";
import SceneManagerSingleton from "../Manager/SceneManager";

class GridView {
  #gridHelper
  #size
  #divisions
  #color1
  #color2
  constructor(size = 10, divisions = 10, color1 = 0x444444, color2 = 0x888888) {
    this.#size = size
    this.#divisions = divisions
    this.#color1 = color1
    this.#color2 = color2
    this.#gridHelper = new GridHelper(this.#size, this.#divisions, this.#color1, this.#color2)
    SceneManagerSingleton.getInstance().scene.add(this.#gridHelper)
    window.addEventListener("keypress", this.ToggleGrid.bind(this))

  }

  #update() {
    this.#gridHelper.dispose()
    SceneManagerSingleton.getInstance().scene.remove(this.#gridHelper)
    this.#gridHelper = new GridHelper(this.#size, this.#divisions, this.#color1, this.#color2)
    SceneManagerSingleton.getInstance().scene.add(this.#gridHelper)
    console.log("Update grid" + this.#size)
  }

  set size(value) {
    this.#size = value
    this.#update()
  }

  set divisions(value) {
    this.#divisions = value
    this.#update()
  }

  set color1(value){
    this.#color1 = value
    this.#update()
  }

  set color2(value){
    this.#color2 = value
    this.#update()
  }

  ToggleGrid(event){
    if (event.key === "g") {
      this.#gridHelper.visible = !this.#gridHelper.visible;
      console.log("pressed G")
    }
  }
}

export default GridView