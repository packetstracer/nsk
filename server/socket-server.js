var socket = require('socket.io');
var io;


var socketServer = {

  createSocketServer: function (httpServer, conf) {
    io = socket(httpServer);
    socketServer.registerSocketDictionaries(conf.dictionaries);
  },


  registerSocketDictionaries: function (dictionaries) {
    dictionaries.map(function (name) {
      var dictionary = require('../app/socket/' + name + 'Dictionary');
      socketServer.registerSocketMessages(dictionary);
    });
  },


  registerSocketMessages: function (dictionary) {
    try {
      var nsp = io.of(dictionary.namespace);

      nsp.on(
        'connection', function (socket) {
          console.log('Socket (%s) connection by client - id: %s', dictionary.namespace, socket.id);

          Object.keys(dictionary.messages).map(function (id) {
            var msg = dictionary.messages[id];

            socketServer.joinSocketRoom(socket, msg);

            console.log('Registering message in namespace#socket: %s - client: %s', socket.id, id);
            socket.on(id, function (ev) {
              !!msg.callback && msg.callback(ev);
              socketServer.emitSocketMessage(socket, msg, ev);
            });
          });
        }
      );
    }
    catch (e) {
      console.log('Socket Error: %s', e.message);
      throw(e);
    }
  },


  joinSocketRoom: function (socket, msg) {
    if (!!msg.room) { // && !socket.adapter.rooms[msg.room]
      console.log('Socket joining room "%s" by client: %s', msg.room, socket.id);
      socket.join(msg.room);
    }
  },


  emitSocketMessage: function (socket, msg, ev) {
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

};


module.exports = socketServer;