var merge = require('webpack-merge')
var prodEnv = require('./prod.env')

module.exports = merge(prodEnv, {
  NODE_ENV: '"development"',
  BASE_API: '"http://47.96.253.233:18501"', //测试1
  // BASE_API: '"http://118.31.249.44:18501"', //测试2
  // BASE_API: '"http://47.97.34.191:18501"', //预发
  // BASE_API: '"http://47.97.81.230:18501"', //线上地址
  // BASE_API: '"http://172.16.20.38:18501"', //本地
})
