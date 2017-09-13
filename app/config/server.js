var conf = {
  env: 'dev',

  port: 4000,

  sslEnabled: true,
  sslPort   : 4001,

  db: {
    type   : 'mongo',
    enabled: false,
    url    : 'mongodb://localhost',
    dbName : 'cop-api-node'
  },

  socket: {
    enabled: true,
    //port   : 4002,
    dictionaries: [
      'general',
      'lkx'
    ]
  },

  routers: {
    static: {
      enabled: true,
      path   : '/public'
    },

    dynamic: {
      enabled  : true,
      server   : 'localhost',
      urlPrefix: '/'
    },

    api: {
      enabled  : true,
      server   : 'localhost',
      urlPrefix: '/api'
    },

    mock: {
      enabled  : true,
      server   : 'localhost',
      urlPrefix: '/mock'
    }
  }
};


module.exports = conf;