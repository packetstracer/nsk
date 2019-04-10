const express = require('express')

const apiMsg = require('../../lang/api-msg')
const Bear = require('../../app/models/bear')

const router = express.Router()

// route middleware for pre processing
router.use(function (req, res, next) {
    console.log(`API request: ${req.method} ${req.originalUrl}`)
    next()
  }
)

// API Route Handling
router.get('/', function (req, res) {
    res.json({
      status: 200,
      message: 'NSK -> API response OK!!!'
    })
  }
)

router.get('/test', function (req, res) {
    res.json({
      status: 200,
      message: 'NSK -> API Test Endpoint response OK!!!'
    })
  }
)

// Bear model CRUD
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
    if (!req.body.name) {
      res.json(400, { error: apiMsg.error_api_wrong_content })
      return false
    }

    let bear = new Bear()
    bear.name = req.body.name
    bear.save(function (error) {
        if (error) {
          res.send(error)
        }

        res.json({ message: apiMsg.msg_api_instance_created })
      }
    )
  })

  .put(function (req, res) {
    if (!req.body.id) {
      res.json(400, { error: 'wrong body content' })
      return false
    }

    Bear.findById(req.body.id, function (error, bear) {
        if (error) {
          res.json(404, { error: 'instance not found' })
        }

        bear.name = req.body.name

        bear.save(function (error) {
            if (error) {
              res.send(error)
            }

            res.json({ message: 'instance saved' })
          }
        )
      }
    )
  })

  .delete(function (req, res) {
    if (!req.body.name) {
      res.json(400, { error: 'wrong body content' })
      return false
    }

    Bear.deleteOne({ name: req.body.name }, function (error, result) {
        if (error) {
          res.send(error)
        }

        res.json(
          (function (result) {
            const CODE = { ok: 'message', ko: 'error' }
            const MESSAGE = { ok: 'instance(s) deleted', ko: 'no instance found' }

            const res = (result.n > 0) ? 'ok' : 'ko'
            let o = {}

            o[CODE[res]] = MESSAGE[res]

            return o
          })(result)
        )
      }
    )
  })

router
  .route('/bears/:bearId')
  .get(function (req, res) {
    if (!req.params.bearId) {
      res.json(400, { error: 'instance id not provided' })
      return false
    }

    Bear.findById(
      req.params.bearId,
      { _id: 0, name: 1 },

      function (error, bear) {
        if (error) {
          res.send(error)
        }

        res.json(bear)
      }
    )
  })

module.exports = router
