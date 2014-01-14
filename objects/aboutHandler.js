
var gc = require('../config.js'); 			// Global Variables.


exports.aboutContent = function(){

	return gc.coreFunctions.readFile(gc.docs_location);

	//return 'Welcome to JADS - Just another developer web server';
}