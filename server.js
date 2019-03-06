const express  = require('express')
const conf     = require('./app/config/server')
const colors   = require('colors')

const webServer         = require('./server/web-server')
const socketServer      = require('./server/socket-server')
const mongodbServer     = require('./server/mongodb-server')
const errorHandlers     = require('./server/error-handlers')
const expressAppFactory = require('./server/express-factory')


// create express app, servers, routers and error handlers
function startServers(conf) {
  const app    = expressAppFactory.createApp().setupApp(conf.routers).getApp()
  const server = webServer.createServer(app, conf).getServer(false)

  errorHandlers.createErrorHandling(app, conf.env)

  if (conf.sslEnabled) {
    webServer.createSslServer(app, conf)
  }

  if (conf.socket.enabled) {
    socketServer.createSocketServer(server, conf.socket)
  }

  if (conf.db.enabled) {
    mongodbServer.connectDb(conf.db)
  }
}


startServers(conf)
