console.log('==============================================================');
console.log(' Welcome to JADS (Just another development (web) server)      ');
console.log(' Build Date: 13/01/13 - build number: 1                       ');
console.log(' Author: Brenton O\'Callaghan (callaghan001@gmail.com)        ');
console.log('==============================================================');

var gc = require('./config.js'); 			// Global Variables.

if(gc.debug_mode_enabled > 0)
	gc.coreFunctions.log('Debug mode is enabled at level ' + gc.debug_mode_enabled + ' - to disable please see config.js', gc.debug_level_info);

var http = require('http'); 				// The standard HTTP node library.
var fs = require('fs');						// The standard file system library.

var request = require(gc.request_object);	// JADS object representing a request object.
var about = require(gc.about_object);		// Import the ABOUT handler for info about BALD.

// Standard handler for any request to the server.
var server = http.createServer(function(req, res) {
	
	if (gc.debug_mode_enabled > 0)
		gc.coreFunctions.log('Request received', gc.debug_level_info);

	// Setup the request object up.
	request.setRequest(req);

	// If the request is for about then we only return the about page.
	if(request.isAboutServerRequest()){

		// Note the request response code.
		res.writeHead(200);

		// Finally set the ABOUT content describing the server.
		res.end(about.aboutContent());

	// Otherwise we return the reequested page.
	}else{

		// First, prepare the request for responding.
		request.generateResponse();

		// Now we simply reply with the response.
    	res.writeHead(request.responseCode);
    	res.end(request.responseString);
	}
});

if (gc.debug_mode_enabled > 0)
	gc.coreFunctions.log('Starting server listening on port ' + gc.server_port, gc.debug_level_info);

// Startup the server and listen on the specified port (usually 8080).
server.listen(gc.server_port);