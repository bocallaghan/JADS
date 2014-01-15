var gc = require('../config.js'); 			// Global Variables.
var err = require(gc.error_object);
var fs    = require('fs');

exports.returnDirectoryContentsForPath = function(fileSystemPath, httpResponse, requestURL){

	fs.readdir(fileSystemPath, function(error, files){

		var responseString = '<html><head></head><body><table>';

		if (error) {
			err.newError(500, 'Unable to complete request - server dir unreadable ', undefined, httpResponse,'jad_directory.js','returnDirectoryContentsForPath');

		}else{
			for (var i = files.length - 1; i >= 0; i--) {

				responseString = responseString + '<tr><td><a href="'+ gc.coreFunctions.joinPaths(requestURL,files[i]) +'">' + files[i] + '</td></tr></li>';
			};
			responseString = responseString + '</table></body></html>';
			httpResponse.setHeader("Content-Type", 'text/html');

			// Write the response code
	    	httpResponse.writeHead(200);

	    	httpResponse.end(responseString);
		}

	});
}