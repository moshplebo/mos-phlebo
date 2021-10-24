// Example webpack configuration with asset fingerprinting in production.
'use strict';

var path = require('path');
var webpack = require('webpack');
var StatsPlugin = require('stats-webpack-plugin');
var ExtractTextPlugin = require("extract-text-webpack-plugin");
var autoprefixer = require('autoprefixer');
var CompressionPlugin = require("compression-webpack-plugin");

// must match config.webpack.dev_server.port
var devServerPort = 3808;

// set NODE_ENV=production on the environment to add asset fingerprints
var production = process.env.NODE_ENV === 'production';

var config = {
  entry: {
    // Sources are expected to live in $app_root/webpack
    'application': './webpack/js/index.jsx',
    'server_render': './webpack/js/server_render.js'
  },

  output: {
    // Build assets directly in to public/webpack/, let webpack know
    // that all webpacked assets start with webpack/

    // must match config.webpack.output_dir
    path: path.join(__dirname, '..', 'public', 'webpack'),
    publicPath: '/webpack/',

    filename: production ? '[name]-[chunkhash].js' : '[name].js'
  },

  resolve: {
    root: path.join(__dirname, '..', 'webpack')
  },

  plugins: [
    // must match config.webpack.manifest_filename
    new ExtractTextPlugin(production ? '[name]-[chunkhash].css' : '[name].css'),
    new StatsPlugin('manifest.json', {
      // We only need assetsByChunkName
      chunkModules: false,
      source: false,
      chunks: false,
      modules: false,
      assets: true
    })
  ],

  module: {
    loaders: [
      {
        test: /(\.scss|\.css)$/,
        loader: ExtractTextPlugin.extract('style', 'css!postcss!resolve-url!sass')
      },
      {
        test: /\.(png|jpg|jpeg|gif)$/,
        loader: 'file?name=images/[name]-[hash:8].[ext]'
      },
      {
        test: /\.(ttf|eot|svg|woff(2)?)(\?.+)?$/,
        loader: 'file?name=fonts/[name]-[hash:8].[ext]'
      },
      {
        test: /\.modernizr$/,
        loader: "modernizr"
      },
      {
        test: /\.(js|jsx)$/,
        exclude: /(node_modules)/,
        loader: 'babel',
        query: {
          plugins: [],
          presets: ['es2015', 'stage-0', 'react']
        }
      }
    ]
  },
  postcss: [ autoprefixer({ browsers: ['> 1%', 'IE 8', 'IE 9'] }) ]
};

if (production) {
  config.plugins.push(
    new webpack.NoErrorsPlugin(),
    new webpack.optimize.UglifyJsPlugin({
      compressor: { warnings: false },
      sourceMap: false
    }),
    new webpack.DefinePlugin({
      'process.env': { NODE_ENV: JSON.stringify('production') }
    }),
    new webpack.optimize.DedupePlugin(),
    new webpack.optimize.OccurenceOrderPlugin(),
    new CompressionPlugin({
        asset: "[path].gz[query]",
        algorithm: "gzip",
        test: /\.js$|\.css$|\.svg/,
        threshold: 10240,
        minRatio: 0.8
    })
  );
} else {
  config.devServer = {
    port: devServerPort,
    headers: { 'Access-Control-Allow-Origin': '*' },
    disableHostCheck: true
  };
  config.output.publicPath = '//10.0.0.104:' + devServerPort + '/webpack/';
  // Source maps
  config.devtool = 'cheap-module-eval-source-map';
}


module.exports = config;
