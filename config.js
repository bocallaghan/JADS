// ===================================
// User-changeable configuration
// ===================================

// The assumed file extension if one is not provided
// Normal web servers would have index.html, index.htm or Default.html
exports.document_default_file = 'index.html';

// Log levels
exports.debug_level_info = 1;
exports.debug_level_full = 2;
exports.debug_level_off = 0;

// locations on disk of the various jads objects.
exports.request_object = './objects/jads_request.js';
exports.about_object = './aboutHandler.js';
exports.error_object = './jads_error.js';

// The MIME types supported by JADS (All others are ignored)
exports.supportedMimeTypes = {
    '.html' : 'text/html',
    '.properties' : 'text/plain',
    '.js' : 'application/javascript',
    '.css' : 'text/css',
    '.json' : 'application/x-json',
    '.xml' : 'application/xml',
    '.md' : 'text/plain',
    '.library' : 'text/plain',
    '.theming' : 'text/plain',
    '.png' : 'image/png',
    '.gif' : 'image/gif',
    '.jpg' : 'image/jpg',
    '.jpeg' : 'image/jpeg',
    '.ttf'  : 'application/octet-stream'
};

// Large file types - this needs to be improved in the future.
exports.streamingFileTypes = {
    '.png' : 'image/png',
    '.gif' : 'image/gif',
    '.jpg' : 'image/jpg',
    '.jpeg' : 'image/jpeg',
    '.ttf'  : 'application/octet-stream'
};

// Access to core functions such as logging.
exports.coreFunctions = require('./objects/globalFunctions.js');		// Core Functions such as logging.