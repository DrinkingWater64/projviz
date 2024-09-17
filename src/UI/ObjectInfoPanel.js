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

function ObjectPanel() {
  const container = new UITabbedPanel();
  container.setId("sidebar");
  
  return container;
}

// function ObjectProperties() {
//   const container = new UISpan();

//   const settings =  new UIPanel();
//   settings.setBorderTop( '0' );
// 	settings.setPaddingTop( '20px' );
// 	container.add( settings );

//   const options = {
// 		en: 'English',
// 		fr: 'Français',
// 		zh: '中文',
// 		ja: '日本語',
// 		ko: '한국어',
// 	};

//   const languageRow = new UIRow();
//   const language = new UISelect().setWidth( '150px' );
//   language.setOptions( options );


// 	languageRow.add( new UIText('Language').setClass( 'Label' ) );
// 	languageRow.add( language );
// 	settings.add( languageRow );
// 	return container;

// }

// function ObjectSelected() {
//   const container = new UIPanel();
//   container.setBorderTop("0");
//   container.setPaddingTop("20px");
//   // container.setDisplay("block");

//   const objectTypeRow = new UIRow();
//   const objectType = new UIText('Why is it not working');

//   objectTypeRow.add(new UIText('Type').setClass("Label"));
//   objectTypeRow.add(objectType);
//   container.add(objectTypeRow)
//   return container;
// }

export { ObjectPanel };
