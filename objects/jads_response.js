
var gc = require('../config.js');               // Global Variables.
var fs = require('fs');                         // The standard file system library.
var util = require('util');                     // The standard file system library.
var err = require(gc.error_object);             // JADS Error Object.
var stream = require('stream');                 // Standard Node Stream Object.
var dir = require('./jads_directory');          // JADS Directory Object.

var request = null;
var response = null;
var validURL = false;
var filePath = null;
var responseData = null;
var responseCode = null;
var dataPayload = false;
var responseContentType = null;

// This function prepares the correct response for any request.
// If the method returns undefined - that means the caller should not proceed
// as the response object has error'd and already posted that error back to the
// requester.
// If it is successful it returns this instance of the JADSResponse object.
exports.prepareResponseForRequest = function (req, httpResponse) {
	
	// Store the request locally.
	this.request = req;

	var aliasLocation, aliasName, fileSystemPath;

	// We first need to make sure we are not dealing with an alias (e.g. sapui5)
	gc.coreFunctions.log('Path Location ' + req.path, gc.debug_level_full);

	// Obtain the alias location if it exists.
	aliasLocation = gc.coreFunctions.isAliasURL(req.path);
	
	// If we have an alias we need to adjust the OS path to account for it.
	if (aliasLocation) {
		gc.coreFunctions.log('Alias based URL requested', gc.debug_level_full);

		// Retrieve the alias base so we know what we need to replace.
		aliasName = gc.coreFunctions.aliasName(req.path);
            
        // Clear up the original path to show without the alias base &
        // Join the alias location with the rest of the inputted URL.
        this.filePath = gc.coreFunctions.joinPaths(aliasLocation, req.path.replace('/' + aliasName, ''));

        // Format the path to work with the OS.
        this.filePath = gc.coreFunctions.formatPath(this.filePath);
		
	} else {
		// Otherise just resolve the file location correcty.
		this.filePath = gc.coreFunctions.resolveFileLocation(req.path);
		gc.coreFunctions.log('Requested file resolved to ' + this.filePath, gc.debug_level_full);
	}

	fileSystemPath = this.filePath;

	// Here we need to check to make sure that even though they might be looking to list the directory, they need a trailing /
    // This is only performed where the request is pointing to a directory object as opposed to a file.
	if (gc.coreFunctions.pathExists(this.filePath) && fs.statSync(this.filePath).isDirectory() && req.path.substr(req.path.length - 1) !== '/') {
        
        // We respond with a permanently moved (301) with the same path and a / at the end.
		this.respondWithPermanentlyMoved(req, httpResponse, req.path + '/');
	    return undefined;

	// Now we need to append a filename if one hasn't been provided (e.g if they pass /f1/f2 rather than /f1/f2/index.html)
	} else if (gc.coreFunctions.pathExists(this.filePath) && fs.statSync(this.filePath).isDirectory()) {
		this.filePath = gc.coreFunctions.joinPaths(this.filePath, gc.document_default_file);
	}

	// We cannot continue if the path does not exist.
	if (gc.coreFunctions.pathExists(this.filePath)) {

		// Now we only continue if the file is of a supported type.
		if (gc.coreFunctions.isSupportedFileType(gc.coreFunctions.getReqestExtension(this.filePath))) {
			
			// If the file type is a payload type (like an image or movie)
			if (gc.coreFunctions.isStreamableFileType(gc.coreFunctions.getReqestExtension(this.filePath))) {
				gc.coreFunctions.log('File ' + this.filePath + ' is streamable', gc.debug_level_full);

				// Mark the file as being a payload
				this.dataPayload = true;

				// Store the content type / MIME type.
				this.responseContentType = gc.supportedMimeTypes[gc.coreFunctions.getReqestExtension(this.filePath)];
			} else {
				// Otherwise we have a normal, understandable file as per the config.
				gc.coreFunctions.log('File ' + this.filePath + ' is a standard request', gc.debug_level_full);

				// 200 = OK as a response code.
				this.responseCode = 200; // OK

				// It is not a data payload (i.e. streamable)
				this.dataPayload = false;

				// Set the content type (MIME type).
				this.responseContentType = gc.supportedMimeTypes[gc.coreFunctions.getReqestExtension(this.filePath)];
			}
		} else {

			// If the file type is unsupported, that is fine but if it is a file without an extension
			// which is sometimes the case for the SAPUI5 docs we should return it as text :(
			if (gc.coreFunctions.getReqestExtension(this.filePath) === '') {

				gc.coreFunctions.log('File ' + this.filePath + ' is a standard request but for a file without an extension', gc.debug_level_full);

				// 200 = OK as a response code.
				this.responseCode = 200; // OK

				// It is not a data payload (i.e. streamable)
				this.dataPayload = false;

				// Set the content type (MIME type).
				this.responseContentType = 'plain/text';
			} else {

				err.newError(500,
					'Unsupported file type ' + gc.coreFunctions.getReqestExtension(this.filePath),
					this.request,
					httpResponse,
					'jad_response.js', 'prepareResponseForRequest');
				return undefined;
			}
		}
		
	} else {
		// If we get here the file request did not exists, however if we appended the default file name (index.html)
		// We should do a directory listing instead so we do that if the path exists.
		if (gc.coreFunctions.pathExists(fileSystemPath) && fs.statSync(fileSystemPath).isDirectory()) {
			dir.returnDirectoryContentsForPath(fileSystemPath, httpResponse, req.path);
			return undefined;
		} else {
			err.newError(404,
					'File ' + this.filePath + ' not found',
					this.request,
					httpResponse,
					'jad_response.js', 'prepareResponseForRequest');
			return undefined;
		}
	}
	return this;
};

// At times we need to respond with a 301 which means the document you are requesting has been permanently
// moved to a different location.
// Mostly this is used when the user is requesting a directory and they forget the / at the end of the URL.
exports.respondWithPermanentlyMoved = function(JadsRequestObject, httpResponse, newLocation) {
    gc.coreFunctions.log('Directory listing required - but missing trailing /', gc.debug_level_full);

    // Set the 'moved' header resonse
    httpResponse.setHeader("Content-Type", "text/html");
    httpResponse.setHeader("Location", newLocation);

    // Write the response code
    httpResponse.writeHead(301);

    // Write the error message
    httpResponse.end('');
}

// Respond to the request provided.
exports.sendResponse = function (httpRes) {

	// If it is not a payload response (not an image or movie etc.)
	if (!this.dataPayload) {
		// Set the content type
		httpRes.setHeader("Content-Type", this.responseContentType);

		// Write the response code
        httpRes.writeHead(this.responseCode);
        
        // We now complete this using the async method as it gives better performance.
        var options = {'encoding' : 'utf8'};
        
        // Read the file specified, then when complete complete and send the request.
        fs.readFile(this.filePath, function (err, data) {
			if (err) {
				err.newError(500, 'Unable to complete request - server file unreadable ', this.request, httpRes, 'jad_response.js', 'sendResponse');
			} else {
				httpRes.end(data);
			}
		});
	} else {
		// Otherwise we have a streamable type so trigger the stream.
		gc.coreFunctions.log('Payload Response Required', gc.debug_level_full);
		this.streamResponse(httpRes);
	}
};

// Stream a response back to the client (e.g. an image).
exports.streamResponse = function (httpRes) {

    var mimeType, filePath;
    
	// Store the mime type & file path. so it can be used in the callbacks
	mimeType = this.responseContentType;
	filePath = this.filePath;

	// Get the stats on the file so we can determine the size.
	fs.stat(this.filePath, function (error, stat) {
        
        var rs;
        
        // Write the header of the response.
        httpRes.writeHead(200, {
            'Content-Type' : mimeType,
            'Content-Length' : stat.size
        });
        
        // Create a read stream from the file (more efficient than other methods).
        // Changed away from using util.pump as it is now deprecated.
        rs = fs.createReadStream(filePath).pipe(httpRes);
    });
};