var devEnv = require('./development')
var env = 'test'
module.exports = Object.assign(devEnv, {
  env: env,
  baseUrl: '' // 项目API地址
})
