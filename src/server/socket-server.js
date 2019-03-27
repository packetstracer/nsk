const socket = require('socket.io')

const mainConsts = require('../const/main.const')

const DICTIONARY_SUFFIX = 'Dictionary'

const socketServer = {
  io: null,

  createSocketServer: function (httpServer, conf) {
    socketServer.io = socket(httpServer)
    socketServer.registerSocketDictionaries(conf.dictionaries)
  },

  registerSocketDictionaries: function (dictionaries) {
    dictionaries.map(function (name) {
      const dictionary = require(`${mainConsts.ROUTES_SOCKET_PATH}/${name}${DICTIONARY_SUFFIX}`)

      socketServer.registerSocketDictionary(dictionary, name)
    })
  },

  registerSocketDictionary: function (dictionary, name) {
    try {
      const nsp = dictionary.namespace ? socketServer.io.of(dictionary.namespace) : socketServer.io

      console.log('Socket :: registering dictionary :: name: %s - namespace: %s', name, dictionary.namespace)

      nsp.on(
        'connection', function (socket) {
          console.log('Socket :: connecting :: client: %s - namespace: %s', socket.id, dictionary.namespace)

          Object.keys(dictionary.messages).map(function (messageId) {
            const message = dictionary.messages[messageId]

            socketServer.joinSocketRoom(socket, message)
            socketServer.registerMessage(socket, messageId, message)
          })
        }
      )
    }
    catch (e) {
      console.log('Socket :: Error :: message: %s', e.message)
      throw(e)
    }
  },

  registerMessage: function (socket, messageId, message) {
    console.log('Socket :: registering message :: client: %s - namespace: %s - message: %s', socket.id, message.namespace, messageId)

    socket.on(messageId, function (ev) {
      !!message.callback && message.callback(ev)
      socketServer.emitSocketMessage(socket, message, ev)
    })
  },

  joinSocketRoom: function (socket, msg) {
    if (!!msg.room) { // && !socket.adapter.rooms[msg.room]
      console.log('Socket :: joining room :: client: %s - room: "%s"', socket.id, msg.room)
      socket.join(msg.room)
    }
  },

  emitSocketMessage: function (socket, msg, ev) {
    if (!!msg.response && !!msg.response.id) {
      console.log('Socket :: sending message :: client %s - room %s - message: %s', socket.id, msg.room, msg.response.id)
      socketServer.io.emit(msg.response.id, msg.response.data(ev, socket))
    }

    if (!!msg.broadcast && !!msg.broadcast.id) {
      console.log('Socket :: broadcasting message :: client: %s - message: %s', socket.id, msg.broadcast.id)

      // if in a room just broadcast into the room
      if (!!msg.room) {
        socket.in(msg.room).emit(msg.broadcast.id, msg.broadcast.data(ev, socket))
      }
      else {
        socket.broadcast.emit(msg.broadcast.id, msg.broadcast.data(ev, socket))
      }
    }
  }

}

module.exports = socketServer
