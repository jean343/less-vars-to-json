const varRgx = /^@/;
const followVar = ( value, lessVars, constants ) => {
	if( varRgx.test( value ) ){
		// value is a variable
		return followVar( lessVars[value] || constants[value.substring( 1 )] );
	}
	return value;
}

export default ( sheet, constants = {} ) => {
	sheet = sheet.replace( /\/\*[\s\S]*?\*\/|([^:]|^)\/\/.*$/gm, '' ) // Replace comments

	const lessVars = {};
	const matches = sheet.match( /@(.*:[^;]*)/g ) || [];

	matches.forEach( variable => {
		const definition = variable.split( /:\s*/ );
		lessVars[definition[0].replace( /['"]+/g, '' ).trim()] = definition.splice( 1 ).join( ':' );
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
