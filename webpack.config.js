var LiveReloadPlugin = require('webpack-livereload-plugin');
var webpack = require('webpack');

module.exports = {
  resolve: {
    extensions: ['', '.scss', '.ts', '.js']
  },

  plugins: [
    new LiveReloadPlugin()
  ],

  entry: './src/main.ts',
  output: {
    path: "./dist",
    filename: "bundle.js"
  },

  module: {
    loaders: [
      {
        test: /\.ts$/,
        loader: 'ts-loader'
      },
      
    ]
  },

  devServer: {
    historyApiFallback: true,
    hot: false
  }
};