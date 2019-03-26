const lkxDictionary = {
  'namespace': '/lkx-sparq',

  messages: {
    'socket-lkx:message-sent': {
      room: 'pinpad',

      callback: function (ev) {
        console.log('Socket (lkx) executing callback')
      },

      response: {
        id  : 'socket-lkx:message-received',
        data: function (ev) {
          return { message: 'SERVER RESPONSE: ' + ev.message }
        }
      },

      broadcast: {
        id  : 'socket-lkx:message-received',
        data: function (ev) {
          return { message: 'SERVER BROADCAST RESPONSE: ' + ev.message }
        }
      }
    },

    'test-message': {
      room: 'pinpad',

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


module.exports = lkxDictionary
