var path = require("path");
var webpack = require("webpack");
var { CheckerPlugin } = require('awesome-typescript-loader');

module.exports = {
  context: path.resolve('.'),
  entry: [
    "babel-polyfill",
    "./ts/bootstrap"
  ],
  output: {
    path: path.resolve('./js'),
    filename: "bundle.js",
    publicPath: "/js/",
    devtoolModuleFilenameTemplate: function (info) {
      return info.resourcePath;
    }
  },
  devtool: 'cheap-eval-source-map',
  module: {
    loaders: [{
      test: /\.tsx?$/,
      loader: "awesome-typescript-loader"
    }, {
      test: /\.js$/,
      enforce: "pre",
      use: [ "source-map-loader" ],
      exclude: path.resolve(__dirname, "node_modules")
    }]
  },
  devServer: {
    inline: true,
    port: 8080
  },
  resolve: {
    extensions: [".ts", ".tsx", ".js", ".json"]
  },
  plugins: [
    new CheckerPlugin()
  ]
};
