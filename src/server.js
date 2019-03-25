const path = require ('path')
const express = require('express')
const colors = require('colors')

setGlobals()

const conf = require('./config/server')

const webServer = require('./server/web-server')
const socketServer = require('./server/socket-server')
const mongodbServer = require('./server/mongodb-server')
const errorHandlers = require('./server/error-handlers')
const expressAppFactory = require('./server/express-factory')

// set applicaction wide global variables
function setGlobals () {
  global.__basedir = path.join( __dirname, '..')
}

// create express app, servers, routers and error handlers
function startServers (conf) {
  const app = expressAppFactory.createApp().setupApp(conf.routers).getApp()
  const server = webServer.createServer(app, conf).getServer(false)

  errorHandlers.createErrorHandling(app, conf.env)

  conf.sslEnabled && webServer.createSslServer(app, conf)
  conf.socket.enabled && socketServer.createSocketServer(server, conf.socket)
  conf.db.enabled && mongodbServer.connectDb(conf.db)
}

startServers(conf)
