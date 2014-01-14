var gc = require('./config.js'); 			// Global Variables.

gc.coreFunctions.log('Debug mode is enabled at level ' + gc.debug_mode_enabled + ' - to disable please see config.js', gc.debug_level_info);

// First perform the standard startup checks (is the config correct etc.)
gc.coreFunctions.startupChecks();

var http = require('http'); 				// The standard HTTP node library.

var jadsRequest = require(gc.request_object);	// JADS object representing a request object.
var jadsAbout = require(gc.about_object);		// Import the ABOUT handler for info about JADS.

// Standard handler for any request to the server.
var server = http.createServer(function(req, res) {
	
	gc.coreFunctions.log('Request received', gc.debug_level_info);

	// Setup the request object up.
	jadsRequest.setRequest(req);

	// If the request is for about then we only return the about page.
	if(jadsRequest.isAboutServerRequest()){

		res.writeHead(200); // Note the request response code.
		res.end(jadsAbout.aboutContent());	// Finally set the ABOUT content describing the server.
		res.setHeader("Content-Type", "text/html"); // Set the mime type

	// Otherwise we return the reequested page.
	}else{

		// First, prepare the request for responding.
		jadsRequest.generateResponse();

		if (jadsRequest.dataPayload) {
			gc.coreFunctions.log('Payload Response Required', gc.debug_level_info);
			jadsRequest.streamResponse(res);
		}else{
			// Now we simply reply with the response.
			res.setHeader("Content-Type", jadsRequest.responseContentType);
    		res.writeHead(jadsRequest.responseCode);
    		res.end(jadsRequest.responseString);
		}
	}	
});

gc.coreFunctions.log('Starting server listening on port ' + gc.server_port, gc.debug_level_info);

// Startup the server and listen on the specified port (usually 8080).
server.listen(gc.server_port);