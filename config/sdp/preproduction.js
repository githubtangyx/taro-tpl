var devEnv = require('./development')
var env = 'preproduction'
module.exports = Object.assign(devEnv, {
  env: env
})
