var http   = require('http');
var https  = require('https');
var socket = require('socket.io');

var fs = require('fs');
var bodyParser   = require('body-parser');
var cookieParser = require('cookie-parser');
var favicon      = require('serve-favicon');

var express  = require('express');
var mongoose = require('mongoose');
var conf     = require('./app/config/server');
var colors   = require('colors');


var app = express();

app.set('view engine', 'jade');
app.set('views', './app/views');


// set App middleware stack
// app.use(favicon('./public/favicon.ico'));
app.use(favicon(__dirname + '/public/favicon.ico'));
app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());
app.use(cookieParser());


// set App servers and routers
connectDb(conf.db);
createRouters(conf.routers);
createErrorHandling(conf.env);
startServers(conf);



function connectDb(conf) {
  try {
    if (!!conf.enabled) {
      mongoose.connect(conf.url + '/' + conf.dbName);
    }
  }
  catch (e) {
    console.log('Api router Error: %s', e.message);
    throw(e);
  }
}


function createRouters(routers) {
  Object.keys(routers).map(function (key) {
    if (!!routers[key] && !!routers[key].enabled) {
      enableRouter(key, routers[key]);
    }
  });
}


function enableRouter(type, routerConf) {
  if (type !== 'static') {
    var router = require('./app/routes/' + type + '/router');
    app.use(routerConf.urlPrefix, router);
  }
  else {
    app.use(express.static('.' + conf.routers.static.path));
  }
}


function startServers(conf) {
  var server = http.createServer(app);

  server.listen(conf.port, function () {
    console.log('COP Server on port %s', conf.port);
  });

  if (!!conf.sslEnabled) {
    var hskey = fs.readFileSync('./certs/lkxa-key.pem');
    var hscert = fs.readFileSync('./certs/lkxa-cert.pem');

    var options = {
      key: hskey,
      cert: hscert
    };

    https.createServer(options, app).listen(conf.sslPort, function () {
      console.log('COP Server SSL on port %s', conf.sslPort);
    });
  }

  if (!!conf.socket.enabled) {
    var io = socket(server);
    registerSocketDictionaries(io, conf.socket.dictionaries);
  }
}


function registerSocketDictionaries(io, dictionaries) {
  dictionaries.map(function (name) {
    var messages = require('./app/socket/' + name + 'Messages');
    registerSocketMessages(io, messages);
  });
}


function registerSocketMessages(io, messages) {
  try {
    io.on(
      'connection', function (socket) {
        console.log('Socket connection by client, id: ' + socket.id);

        Object.keys(messages).map(function (id) {
          var msg = messages[id];

          socket.on(id, function (ev) {
            console.log('Socket message received: ' + ev.message);
            msg.callback(ev);

            if (!!msg.response && !!msg.response.id) {
              console.log('Socket message sent: %s - %s', msg.response.id, msg.response.data(ev, socket).message);
              io.emit(msg.response.id, msg.response.data(ev, socket));
            }
          });
        });
      }
    );
  }
  catch (e) {
    console.log('Socket Error: %s', e.message);
    throw(e);
  }
}

function createErrorHandling(env) {
  // catch 404 and forward to error handler
  app.use(function(req, res, next) {
    var err = new Error('Not Found');
    err.status = 404;
    next(err);
  });

  app.use(function(err, req, res, next) {
    console.error(err);
    res.status(err.status || 500);
    res.render('error', {
      message: err.message,
      error: err
    });
  });
}