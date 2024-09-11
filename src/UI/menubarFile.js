import { UIPanel, UIRow } from "./ui";
import { Loader } from "../core/Loader";

function MenubarFile() {
  const loader = new Loader();

  const container = new UIPanel();
  container.setClass("menu");

  const title = new UIPanel();
  title.setClass("title");
  title.setTextContent("File");
  container.add(title);

  const options = new UIPanel();
  options.setClass("options");
  container.add(options);

  const form = document.createElement("form");
  form.style.display = "none";
  document.body.appendChild(form);

  const fileInput = document.createElement("input");
  fileInput.multiple = true;
  fileInput.type = "file";
  fileInput.addEventListener("change", () => {
    loader.loadFiles(fileInput.files);
    console.log("hello");
  });
  form.appendChild(fileInput);

  let option = new UIRow();
  option.setClass("option");
  option.setTextContent("Import");
  option.onClick(function () {
    fileInput.click();
  });
  options.add(option);

  return container;
}

export { MenubarFile };
