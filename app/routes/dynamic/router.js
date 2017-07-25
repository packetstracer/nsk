var express = require('express');
var router = express.Router();


// route middleware for preprocessing
router.use(function (req, res, next) {
  console.log('Dynamic request: ' + req.method + ' ' + req.originalUrl);
  next();
});


// Dynamic Pages Route Handling
router
  .route('/test')
  .get(function (req, res) {
    res.render('test', {
      title  : 'Dinámico o ke ase!!!',
      testVar: 'jade dynamic content'
    });
  });


router
  .route('/socket-test')
  .get(function (req, res) {
    var controller = require('../../controllers/socket-test.ctrl.js');

    // controller.run();

    res.render('socket-test', {
      title: 'Socket o ke ase!!!'
    })
  });


module.exports = router;