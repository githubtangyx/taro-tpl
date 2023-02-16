var appENV = require('./' + (process.env.npm_config_env || 'local'))
module.exports = appENV
