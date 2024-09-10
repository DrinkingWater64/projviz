import { UIPanel, UIRow} from "./ui";

function MenubarHelp(){
    const container = new UIPanel();
    container.setClass('menu');
    const title = new UIPanel();
    title.setClass('titllete');
    title.setTextContent("Help");
    container.add(title);

    const options = new UIPanel();
    options.setClass('options');
    container.add(options);

    let option = new UIRow();
    option.setClass('option');
    option.setTextContent("source code");
    option.onClick(function () {
        window.open( 'https://github.com/mrdoob/three.js/tree/master/editor', '_blank' );
    });
    options.add( option );

    return container;
}

export {MenubarHelp}