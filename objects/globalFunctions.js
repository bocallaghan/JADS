
var gc = require('../config.js'); 			// Global Variables.
var fs = require('fs');						// The standard file system library.

exports.startupChecks = function(){

	// First we check to make sure that the document root is a valid folder.
	if(!this.pathExists(gc.documents_location)){
		this.log('The supplied webserver document location does not exist - exiting.',gc.debug_level_off);
		process.exit();
	}

	this.log('Startup checks complete', gc.debug_level_info);
}

// A standard function which determines whether to output a log to console.
exports.log = function(message, logLevel){

	// If the global log level is equal to or greater than the
	// supplied log level we output - otherwise we don't.
	if (gc.debug_mode_enabled >= logLevel) {
		console.log(message);
	}

	// TODO - output all logs to a file regardless of log level
}

// Function for checking if a path is valid.
exports.pathExists = function(path){
	
	this.log('Checking that the following path exists: '+path, gc.debug_level_full);

	if (path == null || path == undefined){
		this.log('Path is null or undefined', gc.debug_level_full);
		return false;
	}

	return fs.existsSync(path);
}