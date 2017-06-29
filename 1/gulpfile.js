var gulp = require('gulp');
var gulpUtil = require('gulp-util');
var sourcemaps = require('gulp-sourcemaps');
var webpack = require('webpack');
var stream = require('webpack-stream');
var WebpackDevServer = require('webpack-dev-server');
var webpackConfig = require("./webpack.config.js");

gulp.task('webpack-dev-server', function (callback) {
  var config = Object.create(webpackConfig);
  config.devtool = "eval";

  var compiler = webpack(config);

  new WebpackDevServer(compiler, {
    stats: {
      colors: true,
      overlay: true,
      hot: true
    }
  }).listen(8080, "localhost", function (err) {
    if (err) throw new gulpUtil.PluginError("webpack-dev-server", err);
    gulpUtil.log("[webpack-dev-server]", "http://localhost:8080/app/index.html");
  });
});

gulp.task('webpack', [], function () {
  return gulp.src('app')
    .pipe(sourcemaps.init())
    .pipe(stream(webpackConfig, require('webpack')))
    .pipe(sourcemaps.write())
    .pipe(gulp.dest('app/js'));
});

gulp.task('default', ['webpack']);
gulp.task('dev', ['webpack-dev-server', 'webpack']);
