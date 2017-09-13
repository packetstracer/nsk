var generalDictionary = {
  'namespace': '/general',

  messages: {
    'disconnect': {
      callback: function (socketId) {
        console.log('Socket disconnected by client, id: ' + socketId);
      }
    }
  }
};


module.exports = generalDictionary;