var testMessages = {
  'socket-test:message-sent': {
    callback: function (ev) {

    },

    response: {
      id: 'socket-test:message-received',
      data: function (ev) {
        return { message: ev.message };
      }
    }
  }
};


module.exports = testMessages;