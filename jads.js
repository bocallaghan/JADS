console.log('==========================================');
console.log(' Welcome to JADS (Just another dev server)');
console.log(' Build Date: 13/01/13 - build number: 1   ');
console.log(' Author: Brenton O\'Callaghan');
console.log(' callaghan001@gmail.com')
console.log('==========================================');

var gc = require('./config.js'); 			// Global Variables.

var http = require('http'); 				// The standard HTTP node library.
var fs = require('fs');						// The standard file system library.

var request = require(gc.request_object);	// JADS object representing a request object.
var about = require(gc.about_object);		// Import the ABOUT handler for info about BALD.

// Standard handler for any request to the server.
var server = http.createServer(function(req, res) {
	
	// Setup the request object.
	request.setRequest(req);

	// If the request is for about then we only return the about page.
	if(request.path == about.aboutURL1 || request.path == about.aboutURL2){

		// Note the request response code.
		res.writeHead(200);

		// Finally set the ABOUT content describing the server.
		res.end(about.aboutContent());

	// Otherwise we return the reequested page.
	}else{

		// TODO - do something useful here....
    	res.writeHead(200);
    	res.end('<html><head></head><body><h1>Welcome to JADS</h1><h2>' + request.userAgent + '</h2><h2>' + request.host + '</h2></body></html>');
	}
});

// Startup the server and listen on the specified port (usually 8080).
server.listen(gc.server_port);