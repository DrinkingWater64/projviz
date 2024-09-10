import { UIPanel } from "../UI/ui";
import CanvasManagerSingleton from "../Manager/CanvasManager";
import SceneManagerSingleton from "../Manager/SceneManager";

function Viewport() {
    const container  = new UIPanel();
    container.setId('viewport');
    container.setPosition( 'absolute' );

    let renderer = CanvasManagerSingleton.getInstance().renderer;
    container.dom.appendChild(renderer.domElement);


    let scene = SceneManagerSingleton.getInstance().scene;

    return container;
}

export {Viewport} 