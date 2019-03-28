const nskNamespaceDictionary = {
  namespace: '/nsk',

  messages: {
    'socket-nsk:namespace-message-sent': {
      callback: function (ev, socket) {
        console.log('Socket (nsk namespace) executing callback')
      },

      response: {
        id: 'socket-nsk:namespace-message-received',
        data: function (ev, socket) {
          return {message: 'nskNamespaceDictionary: ' + ev.message}
        }
      }
    },

    'socket-nsk:test-message': {
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
