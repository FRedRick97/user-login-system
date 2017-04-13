const
    gulp = require('gulp'),
    nodemon = require('gulp-nodemon'),
    watch = require('gulp-watch'),
    plumber = require('gulp-plumber'),
    sass = require('gulp-sass');

gulp.task('sass', function() {
    return gulp.src('public/stylesheets/*.sass')
    .pipe(plumber())
    .pipe(sass().on('error', sass.logError))
    .pipe(gulp.dest('public/stylesheets/'));
});

gulp.task('nodemon', function(cb) {
    var callbackCalled = false;
    return nodemon({script: 'app.js'}).on('start', function () {
        if (!callbackCalled) {
            callbackCalled = true;
            cb();
        }
    });
});

gulp.task('watch', function() {
    gulp.watch('public/stylesheets/*.sass', ['sass']);
});

gulp.task('default', ['nodemon','watch']);