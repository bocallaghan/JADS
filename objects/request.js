
var gc = require('../config.js'); 			// Global Variables.

var browserRequest = null;
exports.userAgent = null;
exports.host = null;
exports.url = null;
exports.path = null;
exports.verb = null;

// Setup for this request object.
// Takes a request standard object and extracts relevant information.
exports.setRequest = function(req){

	// Store the request object locally.
	browserRequest = req;

	// If debug is enabled then we output more data.
	if (gc.debug_mode_enabled){
		console.log('Processing new request....');
		console.log('===================== REQUEST SET ======================');
		console.log(browserRequest);
		console.log('===================== =========== ======================');
	}

	// Prepare the relevant info and store into local variables.
	this.userAgent = browserRequest.headers["user-agent"];
	this.host = browserRequest.headers["host"];
	this.url = require('url').parse(browserRequest.url, true);
	this.path = this.url.path;
	this.verb = browserRequest.method; // Get/Put/Post/Update
}