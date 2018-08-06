import stripComments from 'strip-json-comments';

const varRgx = /^@/;
const followVar = ( value, lessVars, constants ) => {
	if( varRgx.test( value ) ){
		// value is a variable
		return followVar( lessVars[value] || constants[value.substring( 1 )] );
	}
	return value;
}

export default ( sheet, constants = {} ) => {
	const lessVars = {};
	const matches = stripComments( sheet ).match( /@(.*:[^;]*)/g ) || [];

	matches.forEach( variable => {
		const definition = variable.split( /:\s*/ );
		let value = definition.splice( 1 ).join( ':' );
		value = value.trim().replace( /^["'](.*)["']$/, '$1' );
		lessVars[definition[0].replace( /['"]+/g, '' ).trim()] = value;
	} );

	Object.keys( lessVars ).forEach( key => {
		const value = lessVars[key];
		lessVars[key] = followVar( value, lessVars, constants );
	} );

	const transformKey = key => key.replace( varRgx, '' );

	return Object.keys( lessVars ).reduce( ( prev, key ) => {
		prev[transformKey( key )] = lessVars[key];
		return prev;
	}, {} );
}
