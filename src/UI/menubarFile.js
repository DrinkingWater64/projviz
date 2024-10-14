import { UIDiv, UIPanel, UIRow, UIButton, UIInput, UIFileInput } from "./ui";
import { Loader } from "../core/Loader";

function MenubarFile() {
  const loader = new Loader();

  const container = new UIPanel();
  container.setClass("menu");

  const uploadPanel = new UploadMenu();

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
  });
  form.appendChild(fileInput);

  let importOption = new UIRow();
  importOption.setClass("option");
  importOption.setTextContent("Import");
  importOption.onClick(function () {
    fileInput.click();
  });
  options.add(importOption);

  let uploadOption = new UIRow();
  uploadOption.setClass("option");
  uploadOption.setTextContent("Upoad");
  uploadOption.onClick(function () {
    // fileInput.click();
    uploadPanel.setDisplay("block");
  });
  options.add(uploadOption);

  return container;
}

function UploadMenu() {
  const panel = new UIDiv();
  panel.setClass("libray");
  panel.setDisplay("none");
  const closeButton = new UIButton("x").setClass('close-btn');
  closeButton.onClick(() => {
    panel.setDisplay('none');
  })


  const scrollBox = new UIDiv();
  scrollBox.setClass("upload-box");
  const fileInput = new UIFileInput();
  scrollBox.add(fileInput);

  panel.add(closeButton);
  panel.add(scrollBox);


  const nameInput = new UIInput("Name").setClass('');
  scrollBox.add(nameInput);
  const categoryInput = new UIInput("Category");
  scrollBox.add(categoryInput);
  const uploadButton = new UIButton("Upload");
  scrollBox.add(uploadButton);

  uploadButton.onClick(() => {
    let formData = new FormData();
    formData.append("modelFile", fileInput.dom.files[0]);
    formData.append("name", nameInput.getValue());
    formData.append("category", categoryInput.getValue());

    fetch("https://localhost:7133/api/Model/upload", {
      method: "POST",
      body: formData,
    })
    .then((response) => {
      if (!response.ok) {
        throw new Error(`Server error: ${response.status}`);
      }
      return response.json();
    })
    .then((data) => {
      // console.log("Model Uploaded successfully", data);
      // You can also alert the user or update the UI after a successful upload
    })
    .catch((error) => {
      console.error("Error uploading model:", error);
      alert(`Failed to upload model: ${error.message}`);
    });

  });

  document.body.appendChild(panel.dom);
  return panel;
}

export { MenubarFile };
