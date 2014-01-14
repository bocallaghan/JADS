
var gc = require('../config.js'); 			// Global Variables.

var response = require('./response.js')

// Request variables
var browserRequest = null;
exports.userAgent = null;
exports.host = null;
exports.url = null;
exports.path = null;
exports.verb = null;
exports.fileType = null;
exports.requestedMimeType = null;
exports.dataPayload = false; // indicates if there is a data payload like an image.

// Response Variables
exports.responseString = null;
exports.responseCode = 500;
exports.responseContentType = null;

// Setup for this request object.
// Takes a request standard object and extracts relevant information.
exports.setRequest = function(req){

	// Store the request object locally.
	browserRequest = req;

	// If debug is enabled then we output more data.
	gc.coreFunctions.log('Setting up request handler object', gc.debug_level_info);
	gc.coreFunctions.log('===================== REQUEST INFO ======================', gc.debug_level_full);
	gc.coreFunctions.log(browserRequest, gc.debug_level_full);
	gc.coreFunctions.log('===================== =========== ======================', gc.debug_level_full);

	// Prepare the relevant info and store into local variables.
	this.userAgent = browserRequest.headers["user-agent"];
	this.host = browserRequest.headers["host"];
	this.url = require('url').parse(browserRequest.url, true);
	this.path = this.url.path;
	this.verb = browserRequest.method; // Get/Put/Post/Update
	this.fileType = gc.coreFunctions.getReqestExtension(this.path);
	this.requestedMimeType = gc.supportedMimeTypes[this.fileType];
}

// Checks if the request is for the standard ABOUT page for the server runtime.
exports.isAboutServerRequest = function(){
	return (this.path == '/about' || this.path == '/about/');
}

// Generate a response that can be returned to the client.
exports.generateResponse = function(){

	// setup the response object
	this.response = response.prepareResponseForRequest(this);
}

// Pass on the stream command to the response object.
exports.streamResponse = function(res){
	// setup the response object
	this.response.streamResponse(res);
}