// ===================================
// Debug levels & log level constants
// ===================================
exports.debug_mode_enabled = 1;			// 0 = no logging, 1 = info level logging, 2 = full logging
exports.debug_level_info = 1;
exports.debug_level_full = 2;
exports.debug_level_off = 0;

// Location of the SAPUI5 libraries
exports.sapui5_location = 'C:\\somwehere';

// Location of the web server document root (without trailing slash)
exports.documents_location = 'C:\\Users\\bocallaghan\\Webserver\\Documents';

// ===================================
// JADS Objects
// ===================================
exports.request_object = './objects/request.js';
exports.about_object = './objects/aboutHandler.js';

// ===================================
// Server listening config
// ===================================
exports.server_port = 8080;			// The port the server should listen on.
exports.server_ip = '127.0.0.1';	// The IP address the server should listen on.

// Access to core functions such as logging.
exports.coreFunctions = require('./objects/globalFunctions.js');		// Core Functions such as logging.