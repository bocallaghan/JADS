
var gc = require('../config.js'); 			// Global Variables.

// A standard function which determines whether to output a log to console.
exports.log = function(message, logLevel){

	// If the global log level is equal to or greater than the
	// supplied log level we output - otherwise we don't.
	if (gc.debug_mode_enabled >= logLevel) {
		console.log(message);
	}

	// TODO - output all logs to a file regardless of log level
}