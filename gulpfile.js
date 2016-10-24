/**
 * Created by stevenbraham on 24-10-16.
 */
var gulp = require('gulp');
var sass = require('gulp-sass');
var connect = require('gulp-connect');
var del = require('del');
var runSequence = require('run-sequence');
var handlebars = require('gulp-compile-handlebars');
var fs = require('fs');

gulp.task('sass', ['clean'], function () {
    return gulp.src('source/scss/**/*.scss')
        .pipe(sass()) // Converts Sass to CSS with gulp-sass
        .pipe(gulp.dest('build/css'));
});

//copy files

gulp.task('copy', function () {
    gulp.src('source/js/**/*.js').pipe(gulp.dest('build/js'));
    gulp.src('source/images/**/*.js').pipe(gulp.dest('build/images'));
});

//file watcher
gulp.task('watch', function () {
    gulp.watch(['source/**/*'], ['build']);
});

//clean build dir
gulp.task('clean', function () {
    return del.sync('build');
})

//webserver
gulp.task('server', function () {
    connect.server({root: "build"});
});

gulp.task('build', function (callback) {
    runSequence(['clean', 'sass', 'handlebars', 'copy'],
        callback
    )
});

gulp.task('handlebars', function () {
    var templateData = JSON.parse(fs.readFileSync('./source/config/handlebars.json'));
    var options = {
        ignorePartials: true,
        batch: ['./source/partials'],
        helpers: {}
    }
    return gulp.src('source/pages/*.html').pipe(handlebars(templateData, options)).pipe(gulp.dest('build'));
});

gulp.task('default', function (callback) {
    runSequence(['build', 'server', 'watch'], callback);
});