var devEnv = require('./development')
var env = 'dev'
module.exports = Object.assign(devEnv, {
  env: env
})
