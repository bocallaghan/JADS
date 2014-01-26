/*
 * Jads can be used in two ways - stand alone, or included in another Node program.
 * To facilitate this, you can require this JADS file and call the start function yourself
 * making sure to provide correct information for the server to run first.
 */

global.jadsGlobal_debugLevel;
global.jadsGlobal_aliasLocations;
global.jadsGlobal_documentsLocation;
global.jadsGlobal_serverPort;
global.jadsGlobal_proxyHost;
global.jadsGlobal_proxyPort;
global.jadsGlobal_proxyUser; 
global.jadsGlobal_proxyPass;

global.jadsGlobal_configSet = false;

// Used for setting up the global variables in JADS
exports.configure = function (logLevel, webDocsLocation, serverPort, proxyHost, proxyPort, proxyUser, proxyPass, aliasLocations) {
    jadsGlobal_debugLevel = logLevel;
    jadsGlobal_documentsLocation = webDocsLocation;
    jadsGlobal_serverPort = serverPort;
    jadsGlobal_proxyHost = proxyHost;
    jadsGlobal_proxyPort = proxyPort;
    jadsGlobal_proxyUser = proxyUser;
    jadsGlobal_proxyPass = proxyPass;
    jadsGlobal_aliasLocations = aliasLocations;
    jadsGlobal_configSet = true;
};

// Main method to be called to start the server.
// Make sure to specify a valid configuration file.
exports.start = function () {
    var gc = require('./config.js');
    var err = require('./objects/' + gc.error_object);
    var http = require('http');
    var jadsRequest = require(gc.request_object);
    
    // First perform the standard startup checks (is the config correct etc.)
    gc.coreFunctions.startupChecks();
            
    // Handler for uncaught exceptions - the most common of which will be attempting to start on a port already in use :)
    process.on('uncaughtException', function (err) {
        if (err.errno === 'EADDRINUSE') {
            gc.coreFunctions.log('Unable to start server on port ' + jadsGlobal_serverPort + '. Check if this port is already in use or change your JADS server config.', gc.debug_level_off);
        } else {
            gc.coreFunctions.log(err, gc.debug_level_off);
        }
        process.exit(1);
    });
    
    
    // Standard handler for any request to the server.
    var server = http.createServer(function (req, res) {
        
        gc.coreFunctions.log('Request received', gc.debug_level_full);
    
        try {
            // Setup the request object up.
            jadsRequest.setRequest(req, this);
    
            // Prepare & send the response back to the requester.
            jadsRequest.sendResponse(res, this);
        } catch (error) {
            err.newError(500, 'Processing of this request terminated abnormally: ' + error, req, res, 'jads.js', 'main');
        }
        
    });
    
    gc.coreFunctions.log('Starting server listening on port ' + jadsGlobal_serverPort, gc.debug_level_info);
    
    // Startup the server and listen on the specified port (usually 8080).
    server.listen(jadsGlobal_serverPort);
};

// If the require main === module - we are being called directly (not included)
if(require.main === module) {
    
    var aliasLocations = {
        'sapui5' : 'C:\\Users\\bocallaghan\\Frameworks\\sapui5',
        'sencha' : 'C:\\Users\\bocallaghan\\Frameworks\\sencha'
    };
    
    // In the case where this is being called standalone - we just start the server.
    this.configure(0, 
                   'C:\\Users\\bocallaghan\\Webserver\\Documents', 
                   8080, 
                   'myHanaServer', 
                   8005, 
                   'POC_USER', 
                   'Password2', 
                   aliasLocations);
    this.start();
}