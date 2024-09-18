import {
  UITabbedPanel,
  UISpan,
  UIPanel,
  UIRow,
  UIInput,
  UIButton,
  UIColor,
  UICheckbox,
  UIInteger,
  UITextArea,
  UIText,
  UINumber,
  UISelect,
} from "./ui";
import { Euler, MathUtils, Vector3 } from "three";

class ObjectDataPanel {
  selectedObject;
  objectPanel;
  objectNameText;
  objectTypeText;
  objectPositionX;
  objectPositionY;
  objectPositionZ;
  objectRotationX;
  objectRotationY;
  objectRotationZ;
  objectScaleX;
  objectScaleY;
  objectScaleZ;
  constructor() {
    this.objectPanel = this.ObjectPanel();
  }

  ObjectPanel() {
    const container = new UITabbedPanel();
    container.setId("sidebar");
    const objectProperties = this.ObjectProperties();
    container.addTab("object", "Object", objectProperties);
    return container;
  }

  ObjectProperties() {
    const container = new UISpan();
    const objectData = this.ObjectData();
    container.add(objectData);
    return container;
  }

  ObjectData() {
    const container = new UIPanel();
    container.setBorderTop("0");
    container.setPaddingTop("20px");
    // settings.setDisplay( 'none' );

    // Type
    const objectTypeRow = new UIRow();
    this.objectTypeText = new UIText();
    objectTypeRow.add(new UIText("Type").setClass("Label"));
    objectTypeRow.add(this.objectTypeText);
    this.objectTypeText.setValue("Typeeee");

    container.add(objectTypeRow);

    // name
    const objectNameRow = new UIRow();
    this.objectNameText = new UIText();
    objectNameRow.add(new UIText("Name").setClass("Label"));
    objectNameRow.add(this.objectNameText);
    this.objectNameText.setValue("nameeeee");

    container.add(objectNameRow);

    // position
    const objectPositionRow = new UIRow();
    this.objectPositionX = new UINumber()
      .setPrecision(3)
      .setWidth("50px")
      .onChange(() => this.UpdatePosition());
    this.objectPositionY = new UINumber()
      .setPrecision(3)
      .setWidth("50px")
      .onChange(() => this.UpdatePosition());
    this.objectPositionZ = new UINumber()
      .setPrecision(3)
      .setWidth("50px")
      .onChange(() => this.UpdatePosition());

    objectPositionRow.add(new UIText("Position").setClass("Label"));
    objectPositionRow.add(
      this.objectPositionX,
      this.objectPositionY,
      this.objectPositionZ
    );

    container.add(objectPositionRow);

    // rotation
    const objectRotationRow = new UIRow();
    this.objectRotationX = new UINumber()
      .setStep(10)
      .setNudge(0.1)
      .setUnit("°")
      .setWidth("50px")
      .onChange(() => this.UpdateRotation());
    this.objectRotationY = new UINumber()
      .setStep(10)
      .setNudge(0.1)
      .setUnit("°")
      .setWidth("50px")
      .onChange(() => this.UpdateRotation());
    this.objectRotationZ = new UINumber()
      .setStep(10)
      .setNudge(0.1)
      .setUnit("°")
      .setWidth("50px")
      .onChange(() => this.UpdateRotation());

    objectRotationRow.add(new UIText("Rotation").setClass("Label"));
    objectRotationRow.add(
      this.objectRotationX,
      this.objectRotationY,
      this.objectRotationZ
    );

    container.add(objectRotationRow);

    // scale
    const objectScaleRow = new UIRow();
    this.objectScaleX = new UINumber(1).setPrecision(3).setWidth("50px");
    this.objectScaleY = new UINumber(1).setPrecision(3).setWidth("50px");
    this.objectScaleZ = new UINumber(1).setPrecision(3).setWidth("50px");

    objectScaleRow.add(new UIText("Scale").setClass("Label"));
    objectScaleRow.add(this.objectScaleX, this.objectScaleY, this.objectScaleZ);

    container.add(objectScaleRow);

    return container;
  }

  Update(o) {
    this.selectedObject = o.object;
    this.objectNameText.setValue(o.object.name);
    this.objectTypeText.setValue(o.object.type);

    this.objectPositionX.setValue(o.object.position.x);
    this.objectPositionY.setValue(o.object.position.y);
    this.objectPositionZ.setValue(o.object.position.z);

    this.objectRotationX.setValue(o.object.rotation.x);
    this.objectRotationY.setValue(o.object.rotation.y);
    this.objectRotationZ.setValue(o.object.rotation.z);

    this.objectScaleX.setValue(o.object.scale.x);
    this.objectScaleY.setValue(o.object.scale.y);
    this.objectScaleZ.setValue(o.object.scale.z);
  }

  UpdatePosition() {
    let position = new Vector3(
      this.objectPositionX.getValue(),
      this.objectPositionY.getValue(),
      this.objectPositionZ.getValue()
    );
    this.selectedObject.position.copy(position);
    // console.log(this);
  }

  UpdateRotation() {
    let newRotation = new Euler(
      this.objectRotationX.getValue() * MathUtils.DEG2RAD,
      this.objectRotationY.getValue() * MathUtils.DEG2RAD,
      this.objectRotationZ.getValue() * MathUtils.DEG2RAD
    );
    if (
      new Vector3()
        .setFromEuler(this.selectedObject.rotation)
        .distanceTo(new Vector3().setFromEuler(newRotation)) >= 0.01
    ) {
      this.selectedObject.rotation.copy(newRotation);
      this.selectedObject.updateMatrixWorld(true);
    }
  }

  UpdateScale() {}
}

export { ObjectDataPanel };
