import * as THREE from "three";
import { LoaderUtils } from "../util/LoaderUtils";
import { TGALoader } from "three/examples/jsm/Addons.js";

class Loader {
  texturePath;
  loaderUtils;
  constructor() {
    this.texturePath = "";
    this.loaderUtils = new LoaderUtils();
  }

  loadItemList(items) {
    this.loaderUtils.getFilesFromItemList(items, (files, filesMap) => {
        this.#loadFiles(files, filesMap);
    })
  }

  #loadFiles(files, filesMap) {
    if (files.length > 0) {
      filesMap = filesMap || this.loaderUtils.createFiiesMap(files);
      const manager = new THREE.LoadingManager();
      manager.setURLModifier((url) => {
        url = url.replace(/^(\.?\/)/, "");
        const file = filesMap[url];
        if (file) {
          console.log("loading ", url);
          return URL.createObjectURL(file);
        }
        return url;
      });

      manager.addHandler(/\.tga$/i, new TGALoader());
      for (let index = 0; index < files.length; index++) {
        this.#loadFile(files[index], manager);
      }
    }
  }

  #loadFile(file, manager) {
    const filename = file.name;
    const extension = filename.split(".").pop().toLowerCase();

    const reader = new FileReader();
    reader.addEventListener("progress", (event) => {
      const size =
        "(" +
        new Intl.NumberFormat("en-us", { useGrouping: true }).format(
          Math.floor(event.total / 1000)
        ) +
        " KB)";
      const progress = Math.floor((event.loaded / event.total) * 100) + "%";
      console.log("Loading", filename, size, progress);
    });
    switch (extension) {
      case "glb": {
        reader.addEventListener(
          "load",
          async (event) => {
            const contents = event.target.result;
            const loader = await this.#createGLTFLoader();

            loader.parse(contents, "", (result) => {
              const scene = result.scene;
              scene.name = filename;

              scene.animations.push(...result.animations);
              loader.dracoLoader.dispose();
              loader.ktx2Loader.dispose();
            });
          },
          false
        );
        reader.readAsArrayBuffer(file);
        break;
      }

      case "gltf": {
        reader.addEventListener(
          "load",
          async (event) => {
            const contents = event.target.result;
            const loader = await this.#createGLTFLoader(manager);
            loader.parse(contents, "", (result) => {
              const scene = result.scene;
              scene.name = filename;
              scene.animations.push(...result.animations);
              loader.dracoLoader.dispose();
              loader.ktx2Loader.dispose();
            });
          },
          false
        );
        reader.readAsArrayBuffer(file);
        break;
      }

      default:
        console.error("Unsupported file format (" + extension + ").");
        break;
    }
  }

  async #createGLTFLoader(manager) {
    const { GLTFLoader } = await import("three/addons/loaders/GLTFLoader.js");
    const { DRACOLoader } = await import("three/addons/loaders/DRACOLoader.js");
    const { KTX2Loader } = await import("three/addons/loaders/KTX2Loader.js");
    const { MeshoptDecoder } = await import(
      "three/addons/libs/meshopt_decoder.module.js"
    );

    const dracoLoader = new DRACOLoader();
    dracoLoader.setDecoderPath("../examples/jsm/libs/draco/gltf/");

    const ktx2Loader = new KTX2Loader(manager);
    ktx2Loader.setTranscoderPath("../examples/jsm/libs/basis/");

    const loader = new GLTFLoader(manager);
    loader.setDRACOLoader(dracoLoader);
    loader.setKTX2Loader(ktx2Loader);
    loader.setMeshoptDecoder(MeshoptDecoder);

    return loader;
  }
}
