const conf = {
  env: 'dev',

  port: 4000,

  sslEnabled: true,
  sslPort: 4001,

  db: {
    type: 'mongo',
    enabled: true,
    host: 'mongodb://localhost',
    dbName: 'nsk'
  },

  socket: {
    enabled: true,
    //port   : 4002,
    dictionaries: [
      'general',
      'nskNamespace',
      'nskRoom'
    ]
  },

  routers: {
    static: {
      enabled: true,
      path: '/public'
    },

    dynamic: {
      enabled: true,
      host: 'localhost',
      urlPrefix: '/'
    },

    api: {
      enabled: true,
      host: 'localhost',
      urlPrefix: '/api'
    },

    mock: {
      enabled: true,
      host: 'localhost',
      urlPrefix: '/mock'
    }
  }
}

module.exports = conf
