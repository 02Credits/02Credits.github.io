var path = require("path");
var webpack = require("webpack");
// var HappyPack = require('happypack');
// var ForkTsCheckerWebpackPlugin = require('fork-ts-checker-webpack-plugin');
// var HtmlWebpackPlugin = require('html-webpack-plugin');
// var ExtractTextPlugin = require('extract-text-webpack-plugin');

module.exports = {
  context: __dirname,
  entry: ["babel-polyfill", "./app/ts/bootstrap"],
  output: {
    path: path.resolve(__dirname, "app/js"),
    filename: "bundle.js",
    publicPath: "/app/",
    devtoolModuleFilenameTemplate: function(info){
      return "file:///"+info.resource;
    }
  },
  devtool: 'source-map',
  module: {
    loaders: [{
      test: /\.tsx?$/,
      loaders: ["babel-loader", "ts-loader"], //"happypack/loader?id=ts"
      exclude: /node_modules/
    }]
  },
  resolve: {
    extensions: [".ts", ".tsx", ".js"],
    alias: {
      'twgl': path.join(__dirname, 'node_modules', 'twgl.js/dist/3.x/twgl-full')
    }
  },
  plugins: [
    // new HappyPack({
    //   id: 'ts',
    //   threads: 2,
    //   loaders: [
    //     {
    //       path: 'ts-loader',
    //       query: { happyPackMode: true }
    //     }
    //   ]
    // }),
    // new ForkTsCheckerWebpackPlugin(),
    // new HtmlWebpackPlugin()
  ]
};
