const path = require('path');
const ExtractTextPlugin = require('extract-text-webpack-plugin');

const extractSass = new ExtractTextPlugin({
  filename: "[name].css"
});

module.exports = {
  target: 'web',
  entry: './src/main.ts',
  devtool: 'source-map',
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        use: 'ts-loader',
        exclude: /node_modules/
      },
      {
        test :/\.(scss|sass)$/,
        use: extractSass.extract({
          use: [
            {
              loader: "css-loader"
            }, {
              loader: "resolve-url-loader"
            }, {
              loader: "sass-loader?sourceMap"
            }
          ],
          fallback: "style-loader"
        })
      },
      { test: /\.woff(2)?(\?v=[0-9]\.[0-9]\.[0-9])?$/, loader: 'url-loader?limit=10000&mimetype=application/font-woff' },
      { test: /\.(ttf|eot|svg)(\?v=[0-9]\.[0-9]\.[0-9])?$/, loader: 'file-loader' }
    ]
  },
  plugins: [
    extractSass
  ],
  resolve: {
    extensions: [ ".tsx", ".ts", ".js" ]
  },
  output: {
    filename: 'bundle.js',
    path: path.resolve(__dirname, 'bin'),
    publicPath: "bin/"
  },
  node: {
    fs: 'empty'
  },
  externals: {
    jquery: 'jQuery',
    Materialize: 'Materialize'
  },
  devServer: {
    inline: true,
    port: 8080
  }
};
