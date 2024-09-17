import { contain } from "three/src/extras/TextureUtils.js";
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
  UISelect
} from "./ui";

function ObjectPanel(){
  const container = new UITabbedPanel();
	container.setId( 'sidebar' );

  container.addTab('object', 'Object', new ObjectProperties());


  return container;
}

function ObjectProperties(){
  const container = new UISpan();

  container.add(new ObjectData())
	return container;
}

function ObjectData(){
  const container = new UIPanel();
	container.setBorderTop( '0' );
	container.setPaddingTop( '20px' );
  // settings.setDisplay( 'none' );


  // Type
  const objectTypeRow = new UIRow();
  const objectTypeText = new UIText();
  objectTypeRow.add(new UIText('Type').setClass('Label'));
  objectTypeRow.add(objectTypeText);
  objectTypeText.setValue('Typeeee');

  container.add(objectTypeRow)


  // name
  const objectNameRow = new UIRow();
  const objectNameText = new UIText();
  objectNameRow.add(new UIText('Name').setClass('Label'));
  objectNameRow.add(objectNameText);
  objectNameText.setValue('nameeeee')

  container.add(objectNameRow)


  // position
  const objectPositionRow = new UIRow();
  const objectPositionX = new UINumber().setPrecision(3).setWidth('50px');
  const objectPositionY = new UINumber().setPrecision(3).setWidth('50px');
  const objectPositionZ = new UINumber().setPrecision(3).setWidth('50px');

  objectPositionRow.add(new UIText('Position').setClass('Label'));
  objectPositionRow.add(objectPositionX, objectPositionY, objectPositionZ);

  container.add(objectPositionRow);

  // rotation
  const objectRotationRow = new UIRow();
  const objectRotationX = new UINumber().setStep(10).setNudge(0.1).setUnit('°').setWidth( '50px' );
  const objectRotationY = new UINumber().setStep(10).setNudge(0.1).setUnit('°').setWidth( '50px' );
  const objectRotationZ = new UINumber().setStep(10).setNudge(0.1).setUnit('°').setWidth( '50px' );

  objectRotationRow.add(new UIText('Rotation').setClass('Label'));
  objectRotationRow.add(objectRotationX, objectRotationY, objectRotationZ);

  container.add(objectRotationRow);

  // scale
  const objectScaleRow = new UIRow();
	const objectScaleX = new UINumber( 1 ).setPrecision( 3 ).setWidth( '50px' );
	const objectScaleY = new UINumber( 1 ).setPrecision( 3 ).setWidth( '50px' );
	const objectScaleZ = new UINumber( 1 ).setPrecision( 3 ).setWidth( '50px' );

	objectScaleRow.add( new UIText( 'Scale' ).setClass( 'Label' ) );
	objectScaleRow.add( objectScaleX, objectScaleY, objectScaleZ );

	container.add( objectScaleRow );



  return container;
  
}

export { ObjectPanel };
