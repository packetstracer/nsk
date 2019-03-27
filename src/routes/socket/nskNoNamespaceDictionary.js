const nskDictionary = {
  'namespace': false,

  messages: {
    'socket-nsk2:message-sent': {
      // room: 'test-room',

      callback: function (ev) {
        console.log('Socket (nsk) executing callback')
      },

      response: {
        id  : 'socket-nsk2:message-received',
        data: function (ev) {
          return { message: 'SERVER RESPONSE: ' + ev.message }
        }
      },

      broadcast: {
        id  : 'socket-nsk2:message-received',
        data: function (ev) {
          return { message: 'SERVER BROADCAST RESPONSE: ' + ev.message }
        }
      }
    },

    'socket-nsk2:test-message': {
      // room: 'test-room',

      callback: function (ev) {
        console.log('Socket executing callback')
      },

      response: {
        id  : 'test-message-received',
        data: function (ev) {
          return { message: 'TEST MESSAGE RECEIVED: ' + ev.message }
        }
      }
    }
  }
}


module.exports = nskDictionary
