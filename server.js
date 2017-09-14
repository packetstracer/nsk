var express  = require('express');
var conf     = require('./app/config/server');
var colors   = require('colors');

var webServer         = require('./server/web-server');
var socketServer      = require('./server/socket-server');
var mongodbServer     = require('./server/mongodb-server');
var errorHandlers     = require('./server/error-handlers');
var expressAppFactory = require('./server/express-factory');


// create express app, servers, routers and error handlers
function startServers(conf) {
  var app    = expressAppFactory.createApp().setupApp(conf.routers).getApp();
  var server = webServer.createServer(app, conf).getServer(false);

  errorHandlers.createErrorHandling(app, conf.env);

  if (conf.sslEnabled) {
    webServer.createSslServer(app, conf);
  }

  if (conf.socket.enabled) {
    socketServer.createSocketServer(server, conf.socket);
  }

  if (conf.db.enabled) {
    mongodbServer.connectDb(conf.db);
  }
}


startServers(conf);