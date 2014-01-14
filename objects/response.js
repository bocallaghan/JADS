
var gc = require('../config.js'); 			// Global Variables.
var fs = require('fs');						// The standard file system library.
var util = require('util');						// The standard file system library.

var request = null;
var validURL = false;
var filePath = null;

exports.prepareResponseForRequest = function(req){
	
	// Store the request locally.
	this.request = req;

	var aliasLocation = undefined;

	// We first need to make sure we are not dealing with an alias (e.g. sapui5)
	gc.coreFunctions.log('Path Location ' +req.path, gc.debug_level_info);
	aliasLocation = gc.coreFunctions.isAliasURL(req.path);
	if (aliasLocation != undefined) {
		gc.coreFunctions.log('Alias based URL requested', gc.debug_level_info);
		this.filePath = req.path.replace('/sapui5', aliasLocation);
	}else{
		// Resolve the file location
		this.filePath = gc.coreFunctions.resolveFileLocation(req.path);
		gc.coreFunctions.log('Requested file resolved to ' +this.filePath, gc.debug_level_info);
	}

	// First we need to append a filename if one hasn't been provided (e.g if they pass /f1/f2 rather than /f1/f2/index.html)
	if (gc.coreFunctions.getReqestExtension(this.filePath) == '') {
		this.filePath = gc.coreFunctions.joinPaths(this.filePath, gc.document_default_file);
	}

	// We cannot continue if the path does not exist.
	if (gc.coreFunctions.pathExists(this.filePath)) {

		// Now we only continue if the file is of a supported type.
		if (gc.coreFunctions.isSupportedFileType(gc.coreFunctions.getReqestExtension(this.filePath))) {
			
			if (gc.coreFunctions.isStreamableFileType(gc.coreFunctions.getReqestExtension(this.filePath))) {
				gc.coreFunctions.log('File '+this.filePath+' is streamable', gc.debug_level_info);
				this.request.dataPayload = true;
			}else{
				gc.coreFunctions.log('File '+this.filePath+' is a standard request', gc.debug_level_info);
				this.request.responseCode = 200; // OK
				this.request.responseString = gc.coreFunctions.readFile(this.filePath)
				this.request.responseContentType = gc.supportedMimeTypes[gc.coreFunctions.getReqestExtension(this.filePath)];
			}
		}else{

			gc.coreFunctions.log('File '+this.filePath+' unsupported', gc.debug_level_info);
			this.request.responseCode = 500; // Not found
			this.request.responseString = 'Unsupported file type '+gc.coreFunctions.getReqestExtension(this.filePath);
			this.request.responseContentType = gc.supportedMimeTypes['.html'];
		}
		
	}else{
		gc.coreFunctions.log('File '+this.filePath+' not found', gc.debug_level_info);
		this.request.responseCode = 404; // Not found
		this.request.responseString = 'File not found';
		this.request.responseContentType = gc.supportedMimeTypes['.html'];
	}
	return this;
}

// Stream a response back to the client (e.g. an image).
exports.streamResponse = function(res){

	var mimeType = this.request.requestedMimeType;
	var filePath = this.filePath;

	fs.stat(this.filePath, function(error, stat) {

    	var rs;
    	res.writeHead(200, {
      		'Content-Type' : mimeType,
      		'Content-Length' : stat.size
    	});

	    rs = fs.createReadStream(filePath);
	    // pump the file to the response
	    util.pump(rs, res, function(err) {
	      if(err) {
	        gc.coreFunctions.log('Error ocurred during response streaming: '+err, gc.debug_level_info);
	      }
	    });
  	});
}