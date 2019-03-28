const nskNamespaceDictionary = {
  namespace: '/nsk',

  messages: {
    'socket-nsk:channel-message-sent': {
      // room: 'test-room',

      callback: function (ev, socket) {
        console.log('Socket (nsk) executing callback')
      },

      response: {
        id: 'socket-nsk:channel-message-received',
        data: function (ev, socket) {
          return {message: 'nskNamespaceDictionary: ' + ev.message}
        }
      }
    },

    'socket-nsk:test-message': {
      // room: 'test-room',

      callback: function (ev, socket) {
        console.log('Socket executing callback')
      },

      response: {
        id: 'socket-nsk:test-message-received',
        data: function (ev, socket) {
          return {message: 'nskNamespaceDictionary: ' + ev.message}
        }
      }
    }
  }
}

module.exports = nskNamespaceDictionary
