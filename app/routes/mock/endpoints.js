// endpoint definitions
var endpoints = {
  'test' : [
    {action: 'GET', uri: '/test', file: 'test'},
    {action: 'POST', uri: '/test', file: 'ok-200'},
    {action: 'PUT', uri: '/test', file: 'ok-200'},
    {action: 'DELETE', uri: '/test', file: 'error-500'}
  ],
  'test2': {action: 'GET', uri: '/test2', file: 'test2'},


  'auth': {
    action: 'POST',
    uri   : '/auth/tsec/token',
    file  : 'tsec-token'
  },
  'admin/users': [
    {
      action: 'GET',
      uri   : '/v1/api/admin/users',
      file  : 'users-get'
    },
    {
      action: 'POST',
      uri   : '/v1/api/admin/users',
      file  : 'users-post'
    }
  ],
  'admin/accounts': {
    action: 'POST',
    uri   : '/v1/api/admin/accounts/unlink',
    file  : 'unlink'
  },
  'admin/accounts/transactions': {
    action: 'GET',
    uri   : '/v1/api/admin/accounts/transactions/:user_id',
    file  : 'transactions-get'
  },
  'admin/settlements': {
    action: 'GET',
    uri   : '/v1/api/admin/settlement/groups',
    file  : 'settlement-groups'
  },
  'admin/file/history': {
    action: 'GET',
    uri   : '/v1/api/admin/file/history',
    file  : 'file-history'
  },
  'admin/recon/empty': {
    action: 'GET',
    uri   : '/v1/api/admin/recon/empty',
    file  : 'empty'
  },
};


module.exports = endpoints;