const fs = require('fs')
const http = require('http')
const https = require('https')

const mainConsts = require('../const/main.const')

let server
let sslServer

const webServer = {

  createServer: function (app, conf) {
    server = http.createServer(app)

    server.listen(conf.port, function () {
      console.log('NSK Server on port %s', conf.port)
    })

    return webServer
  },

  getServer: function (ssl = false) {
    return !ssl ? server : sslServer
  },

  createSslServer: function (app, conf) {
    const hskey = fs.readFileSync(`${mainConsts.CERTS_PATH}/nsk-key.pem`)
    const hscert = fs.readFileSync(`${mainConsts.CERTS_PATH}/nsk-cert.pem`)

    const options = {
      key: hskey,
      cert: hscert
    }

    https.createServer(options, app).listen(conf.sslPort, function () {
      console.log('NSK Server SSL on port %s', conf.sslPort)
    })

    return webServer
  }
}

module.exports = webServer
