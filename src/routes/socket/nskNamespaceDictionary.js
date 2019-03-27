const nskNamespaceDictionary = {
  'namespace': false,

  messages: {
    'socket-nsk:message-sent': {
      room: 'test-room',

      callback: function (ev) {
        console.log('Socket (nsk) executing callback')
      },

      response: {
        id  : 'socket-nsk:message-received',
        data: function (ev) {
          return { message: 'SERVER RESPONSE: ' + ev.message }
        }
      },

      broadcast: {
        id  : 'socket-nsk:message-received',
        data: function (ev) {
          return { message: 'SERVER BROADCAST RESPONSE: ' + ev.message }
        }
      }
    },

    'socket-nsk:test-message': {
      room: 'test-room',

      callback: function (ev) {
        console.log('Socket executing callback')
      },

      response: {
        id  : 'socket-nsk:test-message-received',
        data: function (ev) {
          return { message: 'TEST MESSAGE RECEIVED: ' + ev.message }
        }
      }
    }
  }
}


module.exports = nskNamespaceDictionary
