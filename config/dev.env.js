var merge = require('webpack-merge')
var prodEnv = require('./prod.env')

module.exports = merge(prodEnv, {
  NODE_ENV: '"development"',
  // BASE_API: '"http://172.18.78.230:8009"', //线上
  BASE_API: '"http://47.106.191.91:8009"', //线上
  // BASE_API: '"http://172.16.20.51:8080"', //本地
})
