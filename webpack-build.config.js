/* eslint-env node */
var config = require('./webpack.config.js')
var webpack = require('webpack')
var path = require('path')
config.resolve = {
  alias: {
    './settings.js$': path.resolve(__dirname, './settings-prod.js')
  }
}
module.exports = config
