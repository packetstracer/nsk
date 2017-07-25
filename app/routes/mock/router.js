var express = require('express');
var fs      = require('fs');
var colors  = require('colors');


var router = express.Router();

// route middleware for preprocessing
router.use(function (req, res, next) {
    console.log('Mock request: ' + req.method + ' ' + req.originalUrl);
    next();
  }
);


// API Route Handling
router.get('/', function (req, res) {
  res.json({message: 'Mock o ke ase!!!'});
  // res.set('Content-Type', 'text/xml');
  // res.send({ some: 'json' });
});


const ACTIONS       = ['GET', 'POST', 'PUT', 'DELETE'];
const ACTIONS_COLOR = {
  'GET'   : 'green',
  'POST'  : 'yellow',
  'PUT'   : 'blue',
  'DELETE': 'red'
};

var endpoints = require('./endpoints');


// register endpoints
console.info('\n----------------'.cyan);
console.info('Registered mocks'.cyan);
console.info('----------------\n'.cyan);


function registerRoute(router, endpoint, data, odd) {
  var fontColor = (odd) ? 'white' : 'gray';

  console.log(
    ' [%s]'[ACTIONS_COLOR[data.action]] + ' %s - uri: %s - file: %s.json'[fontColor],
    data.action, endpoint, data.uri, data.file
  );

  router.route(data.uri)[data.action.toLowerCase()](function (req, res) {
      var fileName = __dirname + '/responses/' + endpoint + '/' + data.file + '.json';

      fs.readFile(fileName, 'utf-8', function (err, data) {
          if (err) {
            throw err;
          }

          var mock = JSON.parse(data);

          console.log('Response: ' + mock.code || 200);

          setTimeout(function () {
            res.status(mock.code || 200).json(mock.response || {});
          }, mock.delay || 0);
        }
      );
    }
  );
}


var odd = false;

Object.keys(endpoints).forEach(function (endpoint) {
    var item = this.endpoints[endpoint];
    odd = !odd;

    if (Array.isArray(item)) {
      for (var i = 0; i < item.length; i++) {
        registerRoute(this.router, endpoint, item[i], odd);
      }
    }
    else {
      registerRoute(this.router, endpoint, item, odd);
    }
  }.bind({
    router   : router,
    endpoints: endpoints
  })
);

console.info('\n----------------\n\n'.cyan);


module.exports = router;