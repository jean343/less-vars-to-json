import lessVarsToJS from '../src/index';
import { expect } from 'chai';

describe( 'Given the contents of a less file', () => {
	it( "should read variables that are hex values", () => expect( lessVarsToJS( `
		@blue: #0d3880;
		@pink: #e60278;
    ` ) ).to.deep.equal( {
		'blue': '#0d3880',
		'pink': '#e60278'
	} ) );

	it( "should read variables that are named colours", () => expect( lessVarsToJS( `
		@import (reference) 'theme';
		
		@blue: lightblue;
		@pink: #e60278;
    ` ) ).to.deep.equal( {
		'blue': 'lightblue',
		'pink': '#e60278'
	} ) );

	it( "should follow variable links", () => expect( lessVarsToJS( `
		@import (reference) 'theme';
		
		@blue: lightblue;
		@pink: @blue;
    ` ) ).to.deep.equal( {
		'blue': 'lightblue',
		'pink': 'lightblue'
	} ) );

	it( "should ignore comments", () => expect( lessVarsToJS( `
		// colour palette
		@blue: #0d3880;
		@pink: #e60278;
    ` ) ).to.deep.equal( {
		'blue': '#0d3880',
		'pink': '#e60278'
	} ) );

	it( "should ignore variables in comments", () => expect( lessVarsToJS( `
		@blue: #0d3880; // Comment @blue: blue
		// @blue: blue;
		/* @blue: blue; */
    ` ) ).to.deep.equal( {
		'blue': '#0d3880',
	} ) );

	it( "should ignore import statements", () => expect( lessVarsToJS( `
		@import (reference) 'theme';
		
		@blue: #0d3880;
		@pink: #e60278;
    ` ) ).to.deep.equal( {
		'blue': '#0d3880',
		'pink': '#e60278'
	} ) );

	it( "should ignore rules", () => expect( lessVarsToJS( `
		@import (reference) 'theme';
		
		@blue: #0d3880;
		
		.element {
			color: @foreground;
		}
		
		@pink: #e60278;
    ` ) ).to.deep.equal( {
		'blue': '#0d3880',
		'pink': '#e60278'
	} ) );

	it( "should ignore include variables from within", () => expect( lessVarsToJS( `
		@import (reference) 'theme';
		
		@blue: #0d3880;
		
		.element {
			@foreground: black;
			color: @foreground;
		}
		
		@pink: #e60278;
    ` ) ).to.deep.equal( {
		'blue': '#0d3880',
		'foreground': 'black',
		'pink': '#e60278'
	} ) );

	it( "should not break in file with no variables", () => expect( lessVarsToJS( `
		@import (reference) 'theme';
		
		.element {
			color: black;
		}
    ` ) ).to.deep.equal( {} ) );

	it( "should trim variable names", () => expect( lessVarsToJS( `
		@blue : #0d3880;
    ` ) ).to.deep.equal( {
		'blue': '#0d3880',
	} ) );

	it( "should trim values", () => expect( lessVarsToJS( `
		@blue :   #0d3880  ;
    ` ) ).to.deep.equal( {
		'blue': '#0d3880',
	} ) );

	it( "should read variables that are url", () => expect( lessVarsToJS( `
		@icon-url : "https://xxx.com:8080/t/font";
    ` ) ).to.deep.equal( {
		'icon-url': 'https://xxx.com:8080/t/font'
	} ) );

	it( "should use default variable values", () => expect( lessVarsToJS( `
		@color : @blue;
    `, { blue: "#0000FF" } ) ).to.deep.equal( {
		color: "#0000FF"
	} ) );

	it( "should compile the example", () => expect( lessVarsToJS( `
		// Colour palette
		@blue: #0d3880;
		@pink: #e60278;
		
		// Elements
		@background: @gray;
		@favourite: @blue;
		
		// Grid
		@row-height: 9;
		
		.element {
			@foreground: black;
			color: @foreground;
		}
    `, { gray: "#eee" } ) ).to.deep.equal( {
		"background": "#eee",
		"blue": "#0d3880",
		"favourite": "#0d3880",
		"foreground": "black",
		"pink": "#e60278",
		"row-height": "9",
	} ) );

	it( "should not parse functions", () => expect( lessVarsToJS( `
		@color : darken(@blue, 20%);
    `, { blue: "#0000FF" } ) ).to.deep.equal( {
		color: "darken(@blue, 20%)"
	} ) );
} );