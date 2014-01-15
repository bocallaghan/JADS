var gc = require('../config.js');       // Global Variables.
var err = require(gc.error_object);     // JADS error object.
var fs    = require('fs');              // Node file system object.

exports.returnDirectoryContentsForPath = function (fileSystemPath, httpResponse, requestURL) {
    var i;  // Loop variable used during directory contents looping.
    
	fs.readdir(fileSystemPath, function (error, files) {

		var responseString = '<html><head></head><body><table>';

		if (error) {
			err.newError(500, 'Unable to complete request - server dir unreadable ', undefined, httpResponse, 'jad_directory.js', 'returnDirectoryContentsForPath');

		} else {
			for (i = files.length - 1; i >= 0; i = i - 1) {

				responseString = responseString + '<tr><td><a href="' + gc.coreFunctions.joinPaths(requestURL, files[i]) + '">' + files[i] + '</td></tr></li>';
			}
			responseString = responseString + '</table></body></html>';
			httpResponse.setHeader("Content-Type", 'text/html');

			// Write the response code
            httpResponse.writeHead(200);
            httpResponse.end(responseString);
		}

	});
};