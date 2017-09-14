var express      = require('express');
var bodyParser   = require('body-parser');
var cookieParser = require('cookie-parser');
var favicon      = require('serve-favicon');

var app;


var expressAppFactory = {

  createApp: function () {
    app = express();

    return expressAppFactory;
  },


  getApp: function () {
    return app;
  },


  setupApp: function (conf) {
    expressAppFactory.configApp();
    expressAppFactory.createRouters(app, conf);

    return expressAppFactory;
  },


  configApp: function () {
    app.set('view engine', 'jade');
    app.set('views', './app/views');

    // set App middleware stack
    // app.use(favicon('../public/favicon.ico'));
    // app.use(favicon(__dirname + '/public/favicon.ico'));
    app.use(bodyParser.urlencoded({extended: true}));
    app.use(bodyParser.json());
    app.use(cookieParser());

    return expressAppFactory;
  },


  createRouters: function (expressApp, routers) {
    Object.keys(routers).map(function (key) {
      if (!!routers[key] && !!routers[key].enabled) {
        expressAppFactory.enableRouter(expressApp, key, routers);
      }
    });

    return expressAppFactory;
  },


  enableRouter: function (expressApp, type, routersConf) {
    if (type !== 'static') {
      var router = require('../app/routes/' + type + '/router');
      expressApp.use(routersConf[type].urlPrefix, router);
    }
    else {
      expressApp.use(express.static('..' + routersConf[type].path));
    }
  }

};


module.exports = expressAppFactory;