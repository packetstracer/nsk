const mongoose = require('mongoose')


const mongodbServer = {
  connectDb: function (conf) {
    try {
      mongoose.connect(conf.url + '/' + conf.dbName)
    }
    catch (e) {
      console.log('Api router Error: %s', e.message)
      throw(e)
    }
  }
}


module.exports = mongodbServer
