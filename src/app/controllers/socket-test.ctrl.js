const BaseController = require("./base.ctrl")

const SocketTestCtrl = BaseController.extend(
  {
    run: function (req, res, next) {
      // controller code in here
    }
  }
)

module.exports = new SocketTestCtrl('socket-test')
