const nskRoomDictionary = {
  namespace: false,

  messages: {
    'socket-nsk2:room-message-sent': {
      room: 'nsk-room',

      callback: function (ev) {
        console.log('Socket (nsk room) executing callback')
      },

      response: {
        id: 'socket-nsk2:room-message-received',
        data: function (ev) {
          return {message: 'nskRoomDictionary: ' + ev.message}
        }
      }
    }
  }
}

module.exports = nskRoomDictionary
