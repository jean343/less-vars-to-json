const varRgx = /^@/;
module.exports = sheet => {
	sheet = sheet.replace( /\/\*[\s\S]*?\*\/|([^:]|^)\/\/.*$/gm, '' ) // Replace // comments

	const lessVars = {};
	const matches = sheet.match( /@(.*:[^;]*)/g ) || [];

	matches.forEach( variable => {
		const definition = variable.split( /:\s*/ );
		lessVars[definition[0].replace( /['"]+/g, '' ).trim()] = definition.splice( 1 ).join( ':' );
	} );
	console.log( matches )

	const keys = Object.keys( lessVars );

	const followVar = value => {
		if( varRgx.test( value ) ){
			// value is a variable
			return followVar( lessVars[value] );
		}
		return value;
	}
	Object.keys( lessVars ).map( key => {
		const value = lessVars[key];
		lessVars[key] = followVar( value );
	} );

	const transformKey = key => key.replace( varRgx, '' );

	return keys.reduce( ( prev, key ) => {
		prev[transformKey( key )] = lessVars[key];
		return prev;
	}, {} );
}
