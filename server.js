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
    console.log('NSK Server on port %s', conf.port);
  });

  if (conf.sslEnabled) {
    var hskey = fs.readFileSync('./certs/lkxa-key.pem');
    var hscert = fs.readFileSync('./certs/lkxa-cert.pem');

    var options = {
      key: hskey,
      cert: hscert
    };

    https.createServer(options, app).listen(conf.sslPort, function () {
      console.log('NSK Server SSL on port %s', conf.sslPort);
    });
  }

  if (conf.socket.enabled) {
    var io = socket(server);
    registerSocketDictionaries(io, conf.socket.dictionaries);
  }
}


function registerSocketDictionaries(io, dictionaries) {
  dictionaries.map(function (name) {
    var dictionary = require('./app/socket/' + name + 'Dictionary');
    registerSocketMessages(io, dictionary);
  });
}


function registerSocketMessages(io, dictionary) {
  try {
    var nsp = io.of(dictionary.namespace);

    nsp.on(
      'connection', function (socket) {
        console.log('Socket (%s) connection by client - id: %s', dictionary.namespace, socket.id);

        Object.keys(dictionary.messages).map(function (id) {
          var msg = dictionary.messages[id];

          joinSocketRoom(socket, msg);

          console.log('Registering message in namespace#socket: %s - client: %s', socket.id, id);
          socket.on(id, function (ev) {
            !!msg.callback && msg.callback(ev);
            emitSocketMessage(socket, msg, ev);
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


function joinSocketRoom(socket, msg) {
  if (!!msg.room) { // && !socket.adapter.rooms[msg.room]
    console.log('Socket joining room "%s" by client: %s', msg.room, socket.id);
    socket.join(msg.room);
  }
}


function emitSocketMessage(socket, msg, ev) {
  // var source = (!!msg.room) ? socket.to(msg.room) : socket;

  if (!!msg.response && !!msg.response.id) {
    console.log('Socket sending message to client %s in room %s: %s', socket.id, msg.room, msg.response.id);
    socket.emit(msg.response.id, msg.response.data(ev, socket));
  }

  if (!!msg.broadcast && !!msg.broadcast.id) {
    console.log('Socket broadcasting message by client %s: %s', socket.id, msg.broadcast.id);

    // if in a room just broadcast into the room
    if (!!msg.room) {
      socket.in(msg.room).emit(msg.broadcast.id, msg.broadcast.data(ev, socket));
    }
    else {
      socket.broadcast.emit(msg.broadcast.id, msg.broadcast.data(ev, socket));
    }
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