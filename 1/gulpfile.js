var gulp = require('gulp');
var ts = require('gulp-typescript');
var sass = require('gulp-sass');
var webserver = require('gulp-webserver');
var sourcemaps = require('gulp-sourcemaps');
var del = require('del');

var tsProject = ts.createProject('tsconfig.json');

gulp.task('clean', function () {
    return del([
        'pub/*'
    ]);
});

gulp.task('copy', function () {
    return gulp.src(['src/**/*', '!src/{ts,ts/**}', '!src/{sass,sass/**}'])
        .pipe(gulp.dest('pub'));
});

gulp.task('build-ts', function () {
    return gulp.src('src/ts/**/*.ts')
        .pipe(sourcemaps.init())
        .pipe(tsProject())
        .pipe(sourcemaps.write('.'))
        .pipe(gulp.dest('pub/js'));
});

gulp.task('build-sass', function () {
    return gulp.src('src/sass/**/*.{sass,scss}')
        .pipe(sass())
        .pipe(gulp.dest('pub/css'));
});

gulp.task('build', ['copy', 'build-ts', 'build-sass']);

gulp.task('watch', function () {
    gulp.watch(['src/sass/**/*.{sass,scss}'], ['build-sass']);
    gulp.watch('src/ts/**/*.ts', ['build-ts']);
    gulp.watch(['src/**/*', '!src/**/*.ts', '!src/**/*.sass', '!src/**/*.scss'], ['copy']);
});

gulp.task('webserver', function () {
    return gulp.src('pub')
        .pipe(webserver({
            livereload: true,
            port: 8080
        }));
})

gulp.task('rebuild', ['clean'], function () {
    return gulp.start('build');
});

gulp.task('default', ['rebuild']);

gulp.task('dev', ['rebuild', 'watch'], function () {
    return gulp.start('webserver');
});
