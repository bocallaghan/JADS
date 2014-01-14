// ===================================
// Debug levels & log level constants
// ===================================
exports.debug_mode_enabled = 0;			// 0 = no logging, 1 = info level logging, 2 = full logging
exports.debug_level_info = 1;
exports.debug_level_full = 2;
exports.debug_level_off = 0;

// Location of the SAPUI5 libraries
exports.server_alias_locations = {'sapui5':'C:\\Users\\bocallaghan\\Sapui5', 'about':'./docs/about.html'}

// Location of the web server document root (without trailing slash)
exports.documents_location = 'C:\\Users\\bocallaghan\\Webserver\\Documents';
exports.document_default_file = 'index.html';

// Location of the JADS documentation
exports.docs_location = './docs/about.html';

// ===================================
// JADS Objects
// ===================================
exports.request_object = './objects/jads_request.js';
exports.about_object = './aboutHandler.js';
exports.error_object = './jads_error.js';

// ===================================
// Server listening config
// ===================================
exports.server_port = 8080;			// The port the server should listen on.
exports.server_ip = '127.0.0.1';	// The IP address the server should listen on.

// ===================================
// Supported file extensions
// ===================================
exports.supportedMimeTypes = {'.html':'text/html', 
							  '.properties':'text/plain',
							  '.js':'application/javascript', 
							  '.css':'text/css',
							  '.json':'application/json',
							  '.png':'image/png',
							  '.gif':'image/gif',
							  '.jpg':'image/jpg',
							  '.jpeg':'image/jpeg'}

exports.streamingFileTypes = {'.png':'image/png',
							  '.gif':'image/gif',
							  '.jpg':'image/jpg',
							  '.jpeg':'image/jpeg'}

// Access to core functions such as logging.
exports.coreFunctions = require('./objects/globalFunctions.js');		// Core Functions such as logging.