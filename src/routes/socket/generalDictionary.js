const generalDictionary = {
  namespace: false,

  messages: {
    'disconnect': {
      callback: function (ev, socket) {
        console.log('Socket :: disconnected client :: id: %s', socket)
      }
    },

    'socket-test:message-sent': {
      callback: function (ev, socket) {
        console.log('Socket :: message received :: message: %s', ev.message)
      },

      response: {
        id: 'socket-test:message-received',
        data: function (ev, socket) {
          console.log('Socket :: responding message :: message: %s', ev.message)
          return {message: ev.message}
        }
      }
    },

    'socket-test:message-broadcasted': {
      callback: function (ev, socket) {
        console.log('Socket :: broadcast received :: message: %s', ev.message)
      },

      broadcast: {
        id: 'socket-test:message-broadcasted',
        data: function (ev, socket) {
          console.log('Socket :: broadcasting message :: message: %s', ev.message)
          return {message: ev.message}
        }
      }
    }
  }
}

module.exports = generalDictionary
