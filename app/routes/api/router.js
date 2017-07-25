var express = require('express');

var Bear   = require('../../models/bear');
var rskApi = require('../../libs/rsk-api');


var router = express.Router();

// route middleware for preprocessing
router.use(function (req, res, next) {
    console.log('API request: ' + req.method + ' ' + req.originalUrl);
    next();
  }
);


// API Route Handling
router.get('/', function (req, res) {
    res.json({
      status: 200,
      message: 'Node Server Kit -> API response OK!!!'
    });
  }
);


router.get('/test', function (req, res) {
             res.json({
                        status: 200,
                        message: 'Node Server Kit -> API Test Endpoint response OK!!!'
                      });
           }
);


// Oso model CRUD
router
  .route('/bears')

  .get(function (req, res) {
      Bear.find({}, {_id: 0, name: 1}, function (error, bears) {
        if (error) {
          db.send(error);
        }

        res.json(bears);
      });
    }
  )


  .post(function (req, res) {
    var apiMsg = require('./app/messages/api-msg');

    if (!req.body.name) {
      res.json({error: apiMsg.error_api_wrong_content});
      return false;
    }

    var bear  = new Bear();
    bear.name = req.body.name;
    bear.save(function (error) {
        if (error) {
          res.send(error);
        }

        res.json({message: apiMsg.msg_api_instance_created});
      }
    );
  })


  .put(function (req, res) {
    if (!req.body.id) {
      res.json({error: 'wrong body content'});
      return false;
    }

    Bear.findById(req.body.id, function (error, bear) {
        if (error) {
          res.json(404, {error: 'instance not found'});
        }

        bear.name = req.body.data.name;

        bear.save(function (error, res) {
            if (error) {
              res.send(error);
            }

            res.json({message: 'instance saved'});
          }
        );
      }
    );
  })


  .delete(function (req, res) {
    if (!req.body.name) {
      res.json({error: 'wrong body content'});
      return false;
    }

    Bear.remove({name: req.body.name}, function (error, result) {
        if (error) {
          res.send(error);
        }

        res.json(
          (function (result) {
            const CODE = {
              ok: 'message',
              ko: 'error'
            };

            const MESSAGE = {
              ok: 'instance(s) deleted',
              ko: 'no instance found'
            };

            var res = (result.n > 0) ? 'ok' : 'ko';
            var o   = {};

            o[CODE[res]] = MESSAGE[res];

            return o;
          })(result.result)
        );
      }
    );
  });


router
  .route('/bears/:bear_id')
  .get(function (req, res) {
    if (!req.params.bear_id) {
      res.json({error: 'wrong instance id'});
      return false;
    }

    Bear.findById(
      req.params.bear_id,
      {_id: 0, name: 1},

      function (error, bear) {
        if (error) {
          res.send(error);
        }

        res.json(bear);
      }
    );
  });



/////////////////
// COP API Proxy
/////////////////

//  Auth Token
router
  .route('/auth/tsec/token')
  .get(function (req, res) {
    rskApi.sendRequest(
      {
        endpoint: '/auth/tsec/token',
        method  : 'POST',
        protocol: 'https',
        body    : {
          'grant_type': 'client_credentials'
        }
      },

      function (proxyErr, proxyRes, proxyBody) {
        if (proxyErr) {
          console.log('Error: ', proxyErr);
          return false;
        }

        res.json({code: 200, result: 'ok'});
      }.bind(this)
    );
  });


router
  .route('/v1/api/admin/users')
  .get(function (req, res) {
    rskApi.sendRequest(
      {
        endpoint: '/v1/api/admin/users',
        method  : 'GET',
        protocol: 'https',
        headers : {
          'Authorization': rskApi.generateFullToken()
        },
        query   : {
          page     : req.query.page || 1,
          page_size: req.query.page_size || 20,
          queryString: req.query.queryString || ''
        }
      },

      function (proxyErr, proxyRes, proxyBody) {
        var processed = rskApi.processServerResponse(proxyErr, proxyRes, proxyBody)
        res.statusCode = !!processed.result && processed.result.code || 200;

        return res.json(processed);
      },

      function (proxyErr, proxyRes, proxyBody) {
        var processed = rskApi.processServerResponse(proxyErr, proxyRes, proxyBody)
        res.statusCode = !!processed.result && processed.result.code || 200;

        return res.json(processed);
      }
    );
  });


router
  .route('/v1/api/admin/user')
  .put(function (req, res) {
    rskApi.sendRequest(
      {
        endpoint: '/v1/api/admin/user',
        method  : 'PUT',
        protocol: 'https',
        headers : {
          'Authorization': rskApi.generateFullToken()
        },
        body    : JSON.stringify(req.body),
        bodyType: 'body'
      },

      function (proxyErr, proxyRes, proxyBody) {
        var processed = rskApi.processServerResponse(proxyErr, proxyRes, proxyBody)
        res.statusCode = !!processed.result && processed.result.code || 200;

        return res.json(processed);
      },

      function (proxyErr, proxyRes, proxyBody) {
        var processed = rskApi.processServerResponse(proxyErr, proxyRes, proxyBody)
        res.statusCode = !!processed.result && processed.result.code || 200;

        return res.json(processed);
      }
    );
  });


router
  .route('/v1/api/admin/settlement/groups')
  .get(function (req, res) {
    rskApi.sendRequest(
      {
        endpoint: '/v1/api/admin/settlement/groups',
        method  : 'GET',
        protocol: 'https',
        headers : {
          'Authorization': rskApi.generateFullToken()
        },
        query   : {
          page     : req.query.page || 1,
          page_size: req.query.page_size || 20
        }
      },

      function (proxyErr, proxyRes, proxyBody) {
        var processed = rskApi.processServerResponse(proxyErr, proxyRes, proxyBody)
        res.statusCode = !!processed.result && processed.result.code || 200;

        return res.json(processed);
      },

      function (proxyErr, proxyRes, proxyBody) {
        var processed = rskApi.processServerResponse(proxyErr, proxyRes, proxyBody)
        res.statusCode = !!processed.result && processed.result.code || 200;

        return res.json(processed);
      }
    );
  });


router
  .route('/v1/api/admin/settlement/group')
  .put(function (req, res) {
    rskApi.sendRequest(
      {
        endpoint: '/v1/api/admin/settlement/group',
        method  : 'PUT',
        protocol: 'https',
        headers : {
          'Authorization': rskApi.generateFullToken()
        },
        body    : JSON.stringify(req.body),
        bodyType: 'body'
      },

      function (proxyErr, proxyRes, proxyBody) {
        var processed = rskApi.processServerResponse(proxyErr, proxyRes, proxyBody)
        res.statusCode = !!processed.result && processed.result.code || 200;

        return res.json(processed);
      },

      function (proxyErr, proxyRes, proxyBody) {
        var processed = rskApi.processServerResponse(proxyErr, proxyRes, proxyBody)
        res.statusCode = !!processed.result && processed.result.code || 200;

        return res.json(processed);
      }
    );
  });


router
  .route('/v1/api/admin/accounts/unlink')
  .post(function (req, res) {
    rskApi.sendRequest(
      {
        endpoint: '/v1/api/admin/accounts/unlink',
        method  : 'POST',
        protocol: 'https',
        headers : {
          'Authorization': rskApi.generateFullToken()
        },
        body    : JSON.stringify(req.body),
        bodyType: 'body'
      },

      function (proxyErr, proxyRes, proxyBody) {
        var processed = rskApi.processServerResponse(proxyErr, proxyRes, proxyBody)
        res.statusCode = !!processed.result && processed.result.code || 200;

        return res.json(processed);
      },

      function (proxyErr, proxyRes, proxyBody) {
        var processed = rskApi.processServerResponse(proxyErr, proxyRes, proxyBody)
        res.statusCode = !!processed.result && processed.result.code || 200;

        return res.json(processed);
      }
    );
  });


router
  .route('/v1/api/admin/file/history')
  .get(function (req, res) {
    rskApi.sendRequest(
      {
        endpoint: '/v1/api/admin/file/history',
        method  : 'GET',
        protocol: 'https',
        headers : {
          'Authorization': rskApi.generateFullToken()
        },
        query   : {
          groupId: req.query.groupId
        }
      },

      function (proxyErr, proxyRes, proxyBody) {
        var processed = rskApi.processServerResponse(proxyErr, proxyRes, proxyBody)
        res.statusCode = !!processed.result && processed.result.code || 200;

        return res.json(processed);
      },

      function (proxyErr, proxyRes, proxyBody) {
        var processed = rskApi.processServerResponse(proxyErr, proxyRes, proxyBody)
        res.statusCode = !!processed.result && processed.result.code || 200;

        return res.json(processed);
      }
    );
  });


module.exports = router;