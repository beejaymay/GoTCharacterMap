/* eslint-env node */
var config = require('./webpack.config.js');
var path = require('path');
config.output.publicPath = '/';
config.devtool = 'eval';
config.devServer = {
  inline: true,
  contentBase: path.join(__dirname, 'build'),
  port: 3333,
  host: '0.0.0.0'
};
module.exports = config;
