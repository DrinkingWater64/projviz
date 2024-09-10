import { UIPanel } from "./ui";

import { MenubarHelp } from "./menuHelp";
import { MenubarFile } from "./menubarFile";

function Menubar(){
    const container = new UIPanel();
    container.setId('menubar');

    container.add(new MenubarHelp());
    container.add(new MenubarFile());
    return container;
}

export {Menubar}