var devEnv = require('./development')
var env = 'production'
module.exports = Object.assign(devEnv, {
  env: env,
  ucEnv: 'product',
})
