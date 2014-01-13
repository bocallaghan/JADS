
var gc = require('../config.js'); 			// Global Variables.

// Request variables
var browserRequest = null;
exports.userAgent = null;
exports.host = null;
exports.url = null;
exports.path = null;
exports.verb = null;

// Response Variables
exports.responseString = null;
exports.responseCode = 500;

// Setup for this request object.
// Takes a request standard object and extracts relevant information.
exports.setRequest = function(req){

	// Store the request object locally.
	browserRequest = req;

	// If debug is enabled then we output more data.
	if (gc.debug_mode_enabled > 0){
		console.log('Setting up request handler object');
		if (gc.debug_mode_enabled > 1){
			console.log('===================== REQUEST INFO ======================');
			console.log(browserRequest);
			console.log('===================== =========== ======================');
		}
	}

	// Prepare the relevant info and store into local variables.
	this.userAgent = browserRequest.headers["user-agent"];
	this.host = browserRequest.headers["host"];
	this.url = require('url').parse(browserRequest.url, true);
	this.path = this.url.path;
	this.verb = browserRequest.method; // Get/Put/Post/Update
}

// Checks if the request is for the standard ABOUT page for the server runtime.
exports.isAboutServerRequest = function(){
	return (this.path == '/about' || this.path == '/about/');
}

// Generate a response that can be returned to the client.
exports.generateResponse = function(){
	this.responseCode = 200;
	this.responseString = 'OK';
}