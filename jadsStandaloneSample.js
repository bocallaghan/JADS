var jads = require('./jads.js');

var aliasLocations = {
        'sapui5' : 'C:\\Users\\bocallaghan\\Frameworks\\sapui5',
        'sencha' : 'C:\\Users\\bocallaghan\\Frameworks\\sencha'
};

var logLevel = 0;
    
// In the case where this is being called standalone - we just start the server.
jads.configure(logLevel, // Log level for the server logging.
               'C:\\Users\\bocallaghan\\Webserver\\Documents', // Location of the web server documents folder (no trailing \) 
               8080, // Port to start the server on
               'myHanaServer',  // The OData server to proxy to (e.g. NetWeaver Gateway or Hana etc.)   
               8005, // Port the Odata server is listening on
               'POC_USER',  // Username for authenticating to the proxy server.
               'Password2', // Password for authenticating to the proxy server.
               aliasLocations);
jads.start();