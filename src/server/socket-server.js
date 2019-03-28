const socket = require('socket.io')

const mainConsts = require('../const/main.const')

const DICTIONARY_SUFFIX = 'Dictionary'
const DEFAULT_NAMESPACE_NAME = '/'

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

      console.log('Socket :: registering dictionary :: name: %s - namespace: %s', name, dictionary.namespace || DEFAULT_NAMESPACE_NAME)

      nsp.on(
        'connection', function (socket) {
          console.log('Socket :: connecting :: client: %s - namespace: %s', socket.id, socket.nsp.name || DEFAULT_NAMESPACE_NAME)

          Object.keys(dictionary.messages).map(function (messageId) {
            const message = dictionary.messages[messageId]

            socketServer.joinSocketRoom(socket, message)
            socketServer.registerMessage(socket, messageId, message, dictionary.namespace)
          })
        }
      )
    }
    catch (e) {
      console.log('Socket :: Error :: message: %s', e.message)
      throw(e)
    }
  },

  registerMessage: function (socket, messageId, message, namespace) {
    console.log('Socket :: registering message :: client: %s - message: %s', socket.id, messageId)

    socket.on(messageId, function (ev) {
      !!message.callback && message.callback(ev, socket)
      socketServer.emitSocketMessage(socket, message, ev, namespace)
    })
  },

  joinSocketRoom: function (socket, message) {
    if (!!message.room) { // && !socket.adapter.rooms[message.room]
      console.log('Socket :: joining room :: client: %s - room: "%s"', socket.id, message.room)
      socket.join(message.room)
    }
  },

  emitSocketMessage: function (socket, message, ev, namespace) {
    let socketTarget = null
    let msg = message.broadcast ? message.broadcast : message.response

    if (!msg || !msg.id || !msg.data) {
      return false
    }

    console.log('Socket :: sending message :: client: %s - namespace: %s, room: %s - message: %s', socket.id, namespace, msg.room, msg.id)

    if (!!message.response) {
      socketTarget = socketServer.getSocketTarget(socketServer.io, namespace, msg.room, false)
    }
    else if (!!message.broadcast) {
      socketTarget = socketServer.getSocketTarget(socket, namespace, msg.room, true)
    }

    socketTarget && socketTarget.emit(msg.id, msg.data(ev, socket))
  },

  getSocketTarget: function (socket, namespace, room, broadcast) {
    let socketTarget = socket

    if (room) {
      socketTarget = socket.in(room)
    }
    else if (broadcast) {
      socketTarget = socket.broadcast
    }
    else if (namespace) {
      socketTarget = socket.of(namespace)
    }

    return socketTarget
  }

}

module.exports = socketServer
