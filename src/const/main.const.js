// @NOTE: __basedir is set as a global variable in src/server.js
const ROOT_PATH = __basedir

const SRC_PATH = `${ROOT_PATH}/src`
const APP_PATH = `${SRC_PATH}/app`
const CONFIG_PATH = `${SRC_PATH}/config`
const ROUTES_PATH = `${SRC_PATH}/routes`
const ROUTES_API_PATH = `${ROUTES_PATH}/api`
const ROUTES_DYNAMIC_PATH = `${ROUTES_PATH}/dynamic`
const ROUTES_MOCK_PATH = `${ROUTES_PATH}/mock`
const ROUTES_SOCKET_PATH = `${ROUTES_PATH}/socket`
const SERVER_PATH = `${SRC_PATH}/server`
const CERTS_PATH = `${ROOT_PATH}/certs`

module.exports = {
  ROOT_PATH,
  SRC_PATH,
  APP_PATH,
  CONFIG_PATH,
  ROUTES_PATH,
  ROUTES_API_PATH,
  ROUTES_DYNAMIC_PATH,
  ROUTES_MOCK_PATH,
  ROUTES_SOCKET_PATH,
  SERVER_PATH,
  CERTS_PATH
}
