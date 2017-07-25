var generalMessages = {
  'disconnect': {
    callback: function (socketId) {
      console.log('Socket disconnected by client, id: ' + socketId);
    }
  }
};


module.exports = generalMessages;