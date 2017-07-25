var lkxMessages = {
  'socket-lkx:message-sent': {
    callback: function (ev) {

    },

    response: {
      id: 'socket-lkx:message-received',
      data: function (ev) {
        return { message: 'SERVER RESPONSE: ' + ev.message };
      }
    }
  }
};


module.exports = lkxMessages;