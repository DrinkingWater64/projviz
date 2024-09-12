class UIElement {

	constructor( dom ) {

		this.dom = dom;

	}

	add() {

		for ( let i = 0; i < arguments.length; i ++ ) {

			const argument = arguments[ i ];

			if ( argument instanceof UIElement ) {

				this.dom.appendChild( argument.dom );

			} else {

				console.error( 'UIElement:', argument, 'is not an instance of UIElement.' );

			}

		}

		return this;

	}

	remove() {

		for ( let i = 0; i < arguments.length; i ++ ) {

			const argument = arguments[ i ];

			if ( argument instanceof UIElement ) {

				this.dom.removeChild( argument.dom );

			} else {

				console.error( 'UIElement:', argument, 'is not an instance of UIElement.' );

			}

		}

		return this;

	}

	clear() {

		while ( this.dom.children.length ) {

			this.dom.removeChild( this.dom.lastChild );

		}

	}

	setId( id ) {

		this.dom.id = id;

		return this;

	}

	getId() {

		return this.dom.id;

	}

	setClass( name ) {

		this.dom.className = name;

		return this;

	}

	addClass( name ) {

		this.dom.classList.add( name );

		return this;

	}

	removeClass( name ) {

		this.dom.classList.remove( name );

		return this;

	}

	toggleClass( name, toggle ) {

		this.dom.classList.toggle( name, toggle );

		return this;

	}

	setStyle( style, array ) {

		for ( let i = 0; i < array.length; i ++ ) {

			this.dom.style[ style ] = array[ i ];

		}

		return this;

	}

	setHidden( isHidden ) {

		this.dom.hidden = isHidden;

		return this;

	}

	isHidden() {

		return this.dom.hidden;

	}

	setDisabled( value ) {

		this.dom.disabled = value;

		return this;

	}

	setTextContent( value ) {

		this.dom.textContent = value;

		return this;

	}

	setInnerHTML( value ) {

		this.dom.innerHTML = value;

	}

	getIndexOfChild( element ) {

		return Array.prototype.indexOf.call( this.dom.children, element.dom );

	}

}


const properties = [ 'position', 'left', 'top', 'right', 'bottom', 'width', 'height',
	'display', 'verticalAlign', 'overflow', 'color', 'background', 'backgroundColor', 'opacity',
	'border', 'borderLeft', 'borderTop', 'borderRight', 'borderBottom', 'borderColor',
	'margin', 'marginLeft', 'marginTop', 'marginRight', 'marginBottom',
	'padding', 'paddingLeft', 'paddingTop', 'paddingRight', 'paddingBottom',
	'fontSize', 'fontWeight', 'textAlign', 'textDecoration', 'textTransform', 'cursor', 'zIndex' ];

properties.forEach( function ( property ) {

	const method = 'set' + property.substring( 0, 1 ).toUpperCase() + property.substring( 1 );

	UIElement.prototype[ method ] = function () {

		this.setStyle( property, arguments );

		return this;

	};

} );

// events

const events = [ 'KeyUp', 'KeyDown', 'MouseOver', 'MouseOut', 'Click', 'DblClick', 'Change', 'Input' ];

events.forEach( function ( event ) {

	const method = 'on' + event;

	UIElement.prototype[ method ] = function ( callback ) {

		this.dom.addEventListener( event.toLowerCase(), callback.bind( this ) );

		return this;

	};

} );

class UISpan extends UIElement {

	constructor() {

		super( document.createElement( 'span' ) );

	}

}


class UIDiv extends UIElement {

	constructor() {

		super( document.createElement( 'div' ) );

	}

}

class UIRow extends UIDiv {

	constructor() {

		super();

		this.dom.className = 'Row';

	}

}

class UIPanel extends UIDiv {

	constructor() {

		super();

		this.dom.className = 'Panel';

	}

}

class UIText extends UISpan {

	constructor( text ) {

		super();

		this.dom.className = 'Text';
		this.dom.style.cursor = 'default';
		this.dom.style.display = 'inline-block';

		this.setValue( text );

	}

	getValue() {

		return this.dom.textContent;

	}

	setValue( value ) {

		if ( value !== undefined ) {

			this.dom.textContent = value;

		}

		return this;

	}

}

class UIButton extends UIElement {

	constructor( value ) {

		super( document.createElement( 'button' ) );

		// this.dom.className = 'Button';
		this.dom.textContent = value;

	}
}

export {UIElement, UIDiv, UIPanel, UIRow, UISpan, UIText, UIButton}          