const express = require('express')

const Bear   = require('../../models/bear')
const rskApi = require('../../libs/rsk-api')


const router = express.Router()

// route middleware for pre processing
router.use(function (req, res, next) {
    console.log('API request: ' + req.method + ' ' + req.originalUrl)
    next()
  }
)


// API Route Handling
router.get('/', function (req, res) {
    res.json({
      status: 200,
      message: 'Node Server Kit -> API response OK!!!'
    })
  }
)


router.get('/test', function (req, res) {
    res.json({
      status: 200,
      message: 'Node Server Kit -> API Test Endpoint response OK!!!'
    })
  }
)


// Oso model CRUD
router
  .route('/bears')

  .get(function (req, res) {
      Bear.find({}, {_id: 0, name: 1}, function (error, bears) {
        if (error) {
          db.send(error)
        }

        res.json(bears)
      })
    }
  )


  .post(function (req, res) {
    const apiMsg = require('./app/messages/api-msg')

    if (!req.body.name) {
      res.json({error: apiMsg.error_api_wrong_content})
      return false
    }

    let bear  = new Bear()
    bear.name = req.body.name
    bear.save(function (error) {
        if (error) {
          res.send(error)
        }

        res.json({message: apiMsg.msg_api_instance_created})
      }
    )
  })


  .put(function (req, res) {
    if (!req.body.id) {
      res.json({error: 'wrong body content'})
      return false
    }

    Bear.findById(req.body.id, function (error, bear) {
        if (error) {
          res.json(404, {error: 'instance not found'})
        }

        bear.name = req.body.data.name

        bear.save(function (error, res) {
            if (error) {
              res.send(error)
            }

            res.json({message: 'instance saved'})
          }
        )
      }
    )
  })


  .delete(function (req, res) {
    if (!req.body.name) {
      res.json({error: 'wrong body content'})
      return false
    }

    Bear.remove({name: req.body.name}, function (error, result) {
        if (error) {
          res.send(error)
        }

        res.json(
          (function (result) {
            const CODE = {
              ok: 'message',
              ko: 'error'
            }

            const MESSAGE = {
              ok: 'instance(s) deleted',
              ko: 'no instance found'
            }

            const res = (result.n > 0) ? 'ok' : 'ko'
            let o     = {}

            o[CODE[res]] = MESSAGE[res]

            return o
          })(result.result)
        )
      }
    )
  })


router
  .route('/bears/:bear_id')
  .get(function (req, res) {
    if (!req.params.bear_id) {
      res.json({error: 'wrong instance id'})
      return false
    }

    Bear.findById(
      req.params.bear_id,
      {_id: 0, name: 1},

      function (error, bear) {
        if (error) {
          res.send(error)
        }

        res.json(bear)
      }
    )
  })


module.exports = router
