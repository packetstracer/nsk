const mongoose = require('mongoose')


const mongodbServer = {
  connectDb: function (conf) {
    try {
      mongoose.connect(`${conf.url}/${conf.dbName}`, { useNewUrlParser: true })

      const db = mongoose.connection

      db.on('error', console.error.bind(console, 'connection error:'))

      db.once('open', function() {
        console.log('NSK Connected to MongoDB Server')
      })
    }
    catch (e) {
      console.log('MongoDB Connection Error: %s', e.message)
      throw(e)
    }
  }
}


module.exports = mongodbServer
