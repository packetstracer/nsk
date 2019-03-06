const BaseController = require("./base.ctrl")
const socket = require('socket.io')


const SocketTestCtrl = BaseController.extend(
  {
    run: function (req, res, next) {
      // socket messages declaration moved to server.js
      try {
        const io = socket(server)

        io.on(
          'connection', function (socket) {
            console.log('Socket connection by client, id: ' + socket.id)

            socket.on(
              'disconnect', function () {
                console.log('Socket disconnected by client, id: ' + socket.id)
              }
            )

            socket.on(
              'socket-test:message-sent', function (ev) {
                console.log('Socket message received: ' + ev.message)
                io.emit('socket-test:message-received', {message: ev.message})
              }
            )
          }
        )
      }
      catch (e) {
        console.log('Socket Error: %s', e.message)
        throw(e)
      }
    }
  }
)


module.exports = new SocketTestCtrl('socket-test')
