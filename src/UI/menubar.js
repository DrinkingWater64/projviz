import { UIPanel } from "./ui";

import { MenubarLibrary } from "./menuLibrary";
import { MenubarFile } from "./menubarFile";

function Menubar(){
    const container = new UIPanel();
    container.setId('menubar');
    container.add(new MenubarFile());
    container.add(new MenubarLibrary());
    
    return container;
}

export {Menubar}