
var gc = require('../config.js'); 			// Global Variables.
var fs = require('fs');						// The standard file system library.
var util = require('util');						// The standard file system library.

var request = null;
var validURL = false;
var filePath = null;
var responseData = null;
var responseCode = null;
var dataPayload = false;
var responseContentType = null;

exports.prepareResponseForRequest = function(req){
	
	// Store the request locally.
	this.request = req;

	var aliasLocation = undefined;
	var aliasName = undefined;

	// We first need to make sure we are not dealing with an alias (e.g. sapui5)
	gc.coreFunctions.log('Path Location ' +req.path, gc.debug_level_info);

	// Obtain the alias location if it exists.
	aliasLocation = gc.coreFunctions.isAliasURL(req.path);
	
	// If we have an alias we need to adjust the OS path to account for it.
	if (aliasLocation != undefined) {
		gc.coreFunctions.log('Alias based URL requested', gc.debug_level_info);

		// Retrieve the alias base so we know what we need to replace.
		aliasName = gc.coreFunctions.aliasName(req.path);

		// SERVER SPECIFIC - look for a request for /about/ as this is a internal page
		if (gc.coreFunctions.isAboutServerRequest(aliasName)) {
			this.filePath = aliasLocation;
		}else{
			// Clear up the original path to show without the alias base.
			var removedAlias = req.path.replace('/' + aliasName, '');

			// Join the alias location with the rest of the inputted URL.
			this.filePath = gc.coreFunctions.joinPaths(aliasLocation, removedAlias);

			// Format the path to work with the OS.
			this.filePath = gc.coreFunctions.formatPath(this.filePath);
		}
		
	}else{
		// Otherise just resolve the file location correcty.
		this.filePath = gc.coreFunctions.resolveFileLocation(req.path);
		gc.coreFunctions.log('Requested file resolved to ' +this.filePath, gc.debug_level_info);
	}

	// Now we need to append a filename if one hasn't been provided (e.g if they pass /f1/f2 rather than /f1/f2/index.html)
	if (gc.coreFunctions.getReqestExtension(this.filePath) == '') {
		this.filePath = gc.coreFunctions.joinPaths(this.filePath, gc.document_default_file);
	}

	// We cannot continue if the path does not exist.
	if (gc.coreFunctions.pathExists(this.filePath)) {

		// Now we only continue if the file is of a supported type.
		if (gc.coreFunctions.isSupportedFileType(gc.coreFunctions.getReqestExtension(this.filePath))) {
			
			// If the file type is a payload type (like an image or movie)
			if (gc.coreFunctions.isStreamableFileType(gc.coreFunctions.getReqestExtension(this.filePath))) {
				gc.coreFunctions.log('File '+this.filePath+' is streamable', gc.debug_level_info);

				// Mark the file as being a payload
				this.dataPayload = true;

				// Store the content type / MIME type.
				this.responseContentType = gc.supportedMimeTypes[gc.coreFunctions.getReqestExtension(this.filePath)];
			}else{
				// Otherwise we have a normal, understandable file as per the config.
				gc.coreFunctions.log('File '+this.filePath+' is a standard request', gc.debug_level_info);

				// 200 = OK as a response code.
				this.responseCode = 200; // OK

				// It is not a data payload (i.e. streamable)
				this.dataPayload = false;

				// Set the response to be the contents of the file.
				this.responseString = gc.coreFunctions.readFile(this.filePath);

				// Set the content type (MIME type).
				this.responseContentType = gc.supportedMimeTypes[gc.coreFunctions.getReqestExtension(this.filePath)];
			}
		}else{
			// If the file type is unsupported - respond with a server error (500).
			gc.coreFunctions.log('File '+this.filePath+' unsupported', gc.debug_level_info);
			this.responseCode = 500; // Not found
			this.dataPayload = false;
			this.responseString = 'Unsupported file type '+gc.coreFunctions.getReqestExtension(this.filePath);
			this.responseContentType = gc.supportedMimeTypes['.html'];
		}
		
	}else{
		// If the path is not valid - we cannot find the file. (404)
		gc.coreFunctions.log('File '+this.filePath+' not found', gc.debug_level_info);
		this.responseCode = 404; // Not found
		this.dataPayload = false;
		this.responseString = 'File not found';
		this.responseContentType = gc.supportedMimeTypes['.html'];
	}
	return this;
}

// Respond to the request provided.
exports.sendResponse = function(res){

	// If it is not a payload response (not an image or movie etc.)
	if (!this.dataPayload) {
		// Set the content type
		res.setHeader("Content-Type", this.responseContentType);

		// Write the response code
    	res.writeHead(this.responseCode);

    	// Write the string.
    	res.end(this.responseString);
	}else{
		// Otherwise we have a streamable type so trigger the stream.
		gc.coreFunctions.log('Payload Response Required', gc.debug_level_info);
		this.streamResponse(res);
	}
}

// Stream a response back to the client (e.g. an image).
exports.streamResponse = function(res){

	// Store the mime type & file path. so it can be used in the callbacks
	var mimeType = this.responseContentType;
	var filePath = this.filePath;

	// Get the stats on the file so we can determine the size.
	fs.stat(this.filePath, function(error, stat) {

    	var rs;

    	// Write the header of the response.
    	res.writeHead(200, {
      		'Content-Type' : mimeType,
      		'Content-Length' : stat.size
    	});

    	// Create a read stream from the file (more efficient than other methods).
	    rs = fs.createReadStream(filePath);

	    // pump the file contents into the response
	    util.pump(rs, res, function(err) {
	      if(err) {
	        gc.coreFunctions.log('Error ocurred during response streaming: '+err, gc.debug_level_info);
	      }
	    });
  	});
}