var http  = require('http');
var https = require('https');
var fs    = require('fs');

var server;
var sslServer;


var webServer = {

  createServer: function (app, conf) {
    server = http.createServer(app);

    server.listen(conf.port, function () {
      console.log('NSK Server on port %s', conf.port);
    });

    return webServer;
  },


  getServer: function (ssl) {
    ssl = ssl || false;

    return (!ssl) ? server : sslServer;
  },


  createSslServer: function (app, conf) {
    var hskey = fs.readFileSync('./certs/lkxa-key.pem');
    var hscert = fs.readFileSync('./certs/lkxa-cert.pem');

    var options = {
      key: hskey,
      cert: hscert
    };

    https.createServer(options, app).listen(conf.sslPort, function () {
      console.log('NSK Server SSL on port %s', conf.sslPort);
    });

    return webServer;
  }

};


module.exports = webServer;