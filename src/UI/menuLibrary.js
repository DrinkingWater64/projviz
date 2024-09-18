import { UIDiv, UIPanel, UIRow, UIButton} from "./ui";
import { Loader } from "../core/Loader";

function MenubarLibrary(){
    const loader = new Loader();
    const container = new UIPanel();
    container.setClass('menu');
    const title = new UIPanel();
    title.setClass('title');
    title.setTextContent("Library");
    container.add(title);

    const options = new UIPanel();
    options.setClass('options');
    container.add(options);

    let option = new UIRow();
    option.setClass('option');
    option.setTextContent("ADD");

    let library = new UIDiv();
    library.addClass('libray');
    let scrollBox = new UIDiv();
    scrollBox.setClass('scrollable-box');
    let closebtn =  new UIButton('x').setClass('close-btn');
    closebtn.onClick(() => {
        library.setDisplay('none');
    })
    library.add(closebtn, scrollBox);

    library.setDisplay('none');
    document.body.appendChild(library.dom)

    options.onClick( () => {

        const libraryUrl = "https://localhost:7133/api/Model/list";
        fetch(libraryUrl).then(response => {
            if(!response.ok){
                throw new Error("Response was not OK")
            }
            return response.json();
        }).then(data => {
            // console.log("Model list:", data);
            data.forEach(model => {
                let button = new UIButton(model.name)
                button.onClick(()=>{
                    loader.loadFromServer(model.fileUrl)
                })
                scrollBox.add(button)
            });
        }).catch(error => {
            console.error("there was problem: ", error)
        })


        library.setDisplay('block');
        // options.add(scrollBox)
    });
    options.add( option );

    return container;
}

export {MenubarLibrary}