/* eslint-env node */
var dependencies = require('./package.json').dependencies
var HtmlWebpackPlugin = require('html-webpack-plugin')
var path = require('path')
var webpack = require('webpack')
var isVendor = function(module){
  return (module.resource && module.resource.includes('node_modules'))
}
//These files don't like being webpacked. So we'll skip them.
module.exports = {
  entry: {
    'app': ['babel-polyfill', './src/index.js'],
    'vendor': Object.keys(dependencies)
  },
  output: {
    path: path.join(__dirname, 'docs'),
    filename: '[name].bundle.[chunkhash:8].js'
  },
  module: {
    rules: [
      {
        test: /\.js?$/,
        use: [
          'babel-loader'
        ],
        exclude: /(node_modules)/
      },{
        test: /\.less$/,
        use: [
          'style-loader',
          {loader: 'css-loader', options: { url: false }},
          'less-loader'
        ],
        exclude: /(node_modules)/
      },{
        test: /\.css$/,
        use: [
          'style-loader',
          'css-loader'
        ]
      },{
        test: /\.(png|jpg|gif)$/,
        use: ['url-loader']
      },{
        test: /\.svg$/,
        use: ['raw-loader']
      }
    ]
  },
  plugins: [
    new webpack.optimize.CommonsChunkPlugin({
      names: ['vendor'],
      minChunks: isVendor
    }),
    new HtmlWebpackPlugin({
      title: 'Mully',
      template: 'src/index.ejs',
      filename: 'index.html',
      chunks: ['app', 'vendor']
    }),
    new webpack.IgnorePlugin(/^\.\/locale$/, /moment$/),
    new webpack.ProvidePlugin({
      $: 'jquery',
      jQuery: 'jquery',
      'window.jQuery': 'jquery'
    })
  ]
};
