const express = require('express')
const bodyParser = require('body-parser')
const cookieParser = require('cookie-parser')
// const favicon      = require('serve-favicon')

const mainConsts = require('../const/main.const')

let app

const expressAppFactory = {

  createApp: function () {
    app = express()

    return expressAppFactory
  },

  getApp: function () {
    return app
  },

  setupApp: function (conf) {
    expressAppFactory.configApp()
    expressAppFactory.createRouters(app, conf)

    return expressAppFactory
  },

  configApp: function () {
    app.set('view engine', mainConsts.TEMPLATE_ENGINE)
    app.set('views', mainConsts.VIEWS_PATH)

    // set App middleware stack
    // app.use(favicon('../public/favicon.ico'))
    // app.use(favicon(__dirname + '/public/favicon.ico'))
    app.use(bodyParser.urlencoded({extended: true}))
    app.use(bodyParser.json())
    app.use(cookieParser())

    return expressAppFactory
  },

  createRouters: function (expressApp, routers) {
    Object.keys(routers).map(function (key) {
      if (!!routers[key] && !!routers[key].enabled) {
        expressAppFactory.enableRouter(expressApp, key, routers)
      }
    })

    return expressAppFactory
  },

  enableRouter: function (expressApp, type, routersConf) {
    if (type !== 'static') {
      const router = require(`${mainConsts.ROUTES_PATH}/${type}/router`)
      expressApp.use(routersConf[type].urlPrefix, router)
    }
    else {
      expressApp.use(express.static('..' + routersConf[type].path))
    }
  }

}

module.exports = expressAppFactory
