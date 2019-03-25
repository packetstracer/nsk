const _           = require('lodash')
const querystring = require('querystring')
const buffer      = require('buffer')
const request     = require('request')

const rskConf = require('../../config/rsk-conf')

const RskApi = function (conf) {
  this.appId     = conf.auth.appId
  this.secret    = conf.auth.secret
  this.serverUrl = conf.serverUrl
  this.session   = {
    auth: {}
  }
}


RskApi.prototype.isValidJSON = function (str) {
  try {
    JSON.parse(str)
  }
  catch (e) {
    return false
  }

  return true
}


RskApi.prototype.isSuccessfullStatusCode = function (code) {
  return _.includes([200, 302], code)
}


RskApi.prototype.generateQueryString = function (params) {
  return (!_.isEmpty(params))
    ? '?' + querystring.stringify(_.pickBy(params, function (value, key) {
        return !_.isEmpty(value)
      }))
    : ''
}


RskApi.prototype.generateBasicToken = function () {
  return new buffer.Buffer(this.appId + ':' + this.secret).toString('base64')
}


RskApi.prototype.generateFullToken = function () {
  if (_.isEmpty(this.session.auth)) {
    return false
  }

  return this.session.auth.type + ' ' + this.session.auth.token
}


RskApi.prototype.generateUrl = function (endpoint, protocol, params) {
  return (protocol || 'https') + '://' + this.serverUrl + endpoint + this.generateQueryString(params)
}


RskApi.prototype.generateRequestHeaders = function(customHeaders, postData) {
  var headers = {
    'Accept'                 : 'application/json',
    'Content-Type'           : 'application/json',
    //'Cache-Control'          : 'no-cache',
    'X-Unique-Transaction-ID': new Date().getTime()
  }

  //if (!_.isEmpty(postData)) {
    //headers['Content-Type']   = 'application/x-www-form-urlencoded'
    //headers['Content-Length'] = Buffer.byteLength(querystring.stringify(postData))
  //}

  Object.keys(customHeaders).map(function (headerName) {
    headers[headerName] = customHeaders[headerName]
  })

  return headers
}


RskApi.prototype.generateRequestOptions = function (endpoint, method, headers,
                                                    query, body, bodyType, protocol) {
  const options = {}

  options.url = this.generateUrl(endpoint, protocol, query)
  options.method = (!!method) ? method : 'GET'
  options.headers = this.generateRequestHeaders(headers || {}, body || false)

  if (!!body) {
    options[bodyType || 'form'] = body
  }

  return options
}


RskApi.prototype.sendRequest = function(params, callback, errorCallback) {
  const options = this.generateRequestOptions(
    params.endpoint,
    params.method,
    params.headers,
    params.query,
    params.body,
    params.bodyType,
    params.protocol
  )

  console.log('Request: ', options)

  request(options, function (error, res, body) {
    const result =
          !_.isEmpty(body) && this.isValidJSON(body) && JSON.parse(body).result
          || false

    // if not authenticated then get token then resend request
    if (result.code === 401) {
      console.log('No session - trying authentication')

      this.getTwoLeggedToken(function () {
        params.headers['Authorization'] = rskApi.generateFullToken()
        this.sendRequest(params, callback, errorCallback)
      }.bind(this))
    }
    else if (!!res && !!res.statusCode && this.isSuccessfullStatusCode(res.statusCode)) {
      console.log('Response: ', body)
      !!callback && callback(error, res, body)
    }
    else {
      console.error('Response Error: ', error)
      console.error('Response body: ', body)
      !!errorCallback && errorCallback(error, res, body)
    }
  }.bind(this))
}


RskApi.prototype.getTwoLeggedToken = function(callback) {
  this.sendRequest(
    {
      endpoint: '/auth/tsec/token',
      method  : 'POST',
      protocol: 'https',
      headers : {
        'Authorization': 'Basic ' + this.generateBasicToken()
      },
      body    : {
        'grant_type': 'client_credentials'
      }
    },

    function (proxyErr, proxyRes, proxyBody) {
      const body = JSON.parse(proxyBody) || false

      if (proxyErr || !body.access_token) {
        //console.log('Aut Error (2 legged token): ', proxyErr)
        return false
      }

      this.saveSessionData(body)

      !!callback && callback()
    }.bind(this)
  )
}


RskApi.prototype.saveSessionData = function (data) {
  this.session.auth.token      = (!!data.access_token) ? data.access_token : ''
  this.session.auth.type       = (!!data.token_type) ? data.token_type : ''
  this.session.auth.expiration = (!!data.expires_id) ? data.expires_id : ''
  this.session.auth.scopes     = (!!data.scope) ? data.scope.split(' ') : []
}


RskApi.prototype.processServerResponse = function (err, res, body) {
  if (err) {
    //@TODO handle response errors
    console.log('Error: ', err)
    return false
  }
  else if (rskApi.isValidJSON(body)) {
    return JSON.parse(body)
  }

  return {
    result: {
      'code': 404,
      'info': 'no results returned'
    }
  }
}


const rskApi = new RskApi(rskConf)


module.exports = rskApi
