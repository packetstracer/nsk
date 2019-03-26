const express = require('express')
const router = express.Router()

const mainConsts = require('../../const/main.const')

// route middleware for pre processing
router.use(function (req, res, next) {
  console.log(`Dynamic request: ${req.method} ${req.originalUrl}`)
  next()
})

// Dynamic Pages Route Handling
router
  .route('/test')
  .get(function (req, res) {
    res.render('test', {
      title: 'Dynamic Content Page!!!',
      testVar: 'pug dynamic content'
    })
  })

router
  .route('/socket-test')
  .get(function (req, res) {
    const controller = require(`${mainConsts.APP_PATH}/controllers/socket-test.ctrl.js`)

    controller.run()

    res.render('socket-test', {
      title: 'Socket Test Page!!!'
    })
  })

module.exports = router
