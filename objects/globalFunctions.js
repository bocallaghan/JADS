
var gc = require('../config.js'); 			// Global Variables.
var fs = require('fs');						// The standard file system library.
var path = require('path');

exports.startupChecks = function(){

	// First we check to make sure that the document root is a valid folder.
	if(!this.pathExists(gc.documents_location)){
		this.log('The supplied webserver document location does not exist - exiting.',gc.debug_level_off);
		process.exit();
	}

	this.log('Startup checks complete', gc.debug_level_info);
}

// ==============================================================================================
//
// Logging Functions
//
// ==============================================================================================

// A standard function which determines whether to output a log to console.
exports.log = function(message, logLevel){

	// If the global log level is equal to or greater than the
	// supplied log level we output - otherwise we don't.
	if (gc.debug_mode_enabled >= logLevel) {
		console.log(message);
	}

	// TODO - output all logs to a file regardless of log level
}
// ==============================================================================================
//
// PATH FUNCTIONS
//
// ==============================================================================================
exports.formatPath = function(path){
	return path.normalize(path);
}

// Determine the correct extension from a path
exports.getReqestExtension = function(requestURL){
	return path.extname(requestURL);
}


exports.resolveFileLocation = function(requestURL){
	return path.join(gc.documents_location, requestURL);
}

exports.getRequestFolders = function(requestURL){
	this.log('Splitting request path to:' + requestURL.split('/'), gc.debug_level_full);
	return requestURL.split('/');
}

exports.joinPaths = function(p1, p2){
	return path.join(p1, p2);
}

exports.isAliasURL = function(requestURL){

	var aliasLocation = undefined;

	var splitPath = this.getRequestFolders(requestURL);
	this.log('Checking for alias using parameter:' +splitPath[1], gc.debug_level_full);

	if (aliasLocation = gc.server_alias_locations[splitPath[1]]) {
		return aliasLocation;
	}
}

// ==============================================================================================
//
// FILE FUNCTIONS
//
// ==============================================================================================

// Function for checking if a path is valid.
exports.pathExists = function(path){
	
	this.log('Checking that the following path exists: '+path, gc.debug_level_full);

	if (path == null || path == undefined){
		this.log('Path is null or undefined', gc.debug_level_full);
		return false;
	}

	return fs.existsSync(path);
}

// Function to read the contents of a file into a string.
exports.readFile = function(filename){
	
	// Do a quick check to make sure we have a filename
	if (!filename || filename == null || filename == undefined)
		return '';

	// Options when reading a file.
	var options = {'encoding':'utf8'};

	// Log out the file we are loading
	this.log('File to be loaded: '+filename, gc.debug_level_full);

	// Return the value from the file read.
	return fs.readFileSync(filename, options);
}

// Checks the global configuration to see if the extension is supported.
exports.isSupportedFileType = function(extension){

	if (gc.supportedMimeTypes[extension] != undefined)
		return true;

	this.log('Unsupported file type '+extension, gc.debug_level_info);
	return false;
}

// Checks the passed in extension and indicates if the file is streamable (i.e. an image).
exports.isStreamableFileType = function(extension){

	if (gc.streamingFileTypes[extension] != undefined)
		return true;

	return false;
}
// ==============================================================================================
//
// 
//
// ==============================================================================================