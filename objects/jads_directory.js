var gc = require('../config.js');       // Global Variables.
var err = require(gc.error_object);     // JADS error object.
var fs    = require('fs');              // Node file system object.

exports.returnDirectoryContentsForPath = function (fileSystemPath, httpResponse, requestURL) {
    var i;  // Loop variable used during directory contents looping.
    
	fs.readdir(fileSystemPath, function (error, files) {

		var responseBody, fileType, fileStats, responseStringFiles = '<table class="files">', responseStringDirs = '<table class="dirs">';
        
        responseBody = fs.readFileSync('./objects/jads_dir_list.template', {encoding : 'utf-8'});

		if (error) {
			err.newError(500, 'Unable to complete request - server dir unreadable ', undefined, httpResponse, 'jad_directory.js', 'returnDirectoryContentsForPath');

		} else {
			for (i = files.length - 1; i >= 0; i = i - 1) {
                
                fileStats = fs.statSync(fileSystemPath + files[i]);
                
                if (!fileStats.isFile()) {
                    fileType = 'Dir';
                    responseStringDirs = responseStringDirs + '<tr><td>' + fileType + '</td><td><a href="' + gc.coreFunctions.joinPaths(requestURL, files[i]) + '">' + files[i] + '</a></td></tr>';

                } else {
                    fileType = 'File';
                    responseStringFiles = responseStringFiles + '<tr><td>' + fileType + '</td><td><a href="' + gc.coreFunctions.joinPaths(requestURL, files[i]) + '">' + files[i] + '</a></td></tr>';

                }

			}
			responseStringFiles = responseStringFiles + '</table>';
            responseStringDirs = responseStringDirs + '</table>';
			httpResponse.setHeader("Content-Type", 'text/html');
            
            responseBody = responseBody.replace('{dirContents}', responseStringDirs + responseStringFiles);
            responseBody = responseBody.replace(new RegExp('{dirName}', 'g'), requestURL);

			// Write the response code
            httpResponse.writeHead(200);
            httpResponse.end(responseBody);
		}

	});
};