const errorHandlers = {
  createErrorHandling: function (expressApp, environment) {
    // catch 404 and forward to error handler
    expressApp.use(function (req, res, next) {
      let err = new Error('Not Found')
      err.status = 404

      next(err)
    })

    expressApp.use(function (err, req, res, next) {
      console.error(err)
      res.status(err.status || 500)
      res.render('error', {
        message: err.message,
        error  : err
      })
    })
  }
}


module.exports = errorHandlers
