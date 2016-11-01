/**
 * Created by stevenbraham on 24-10-16.
 */
var gulp = require('gulp');
var sass = require('gulp-sass');
var connect = require('gulp-connect');
var del = require('del');
var runSequence = require('run-sequence');
var handlebars = require('gulp-compile-handlebars');
var htmlbeautify = require('gulp-html-beautify');
var cssbeautify = require('gulp-cssbeautify');
var fs = require('fs');
var html5Lint = require('gulp-html5-lint');
var csslint = require('gulp-csslint');

gulp.task('css', function () {
    gulp.src('build/css/*.css')
        .pipe(csslint({
            "ids": false,
        }))
        .pipe(csslint.formatter());
});

gulp.task('html5-lint', function () {
    return gulp.src('build/*.html')
        .pipe(html5Lint());
});

gulp.task('sass', ['clean'], function () {
    // return gulp.src('source/scss/**/*.scss')
    //     .pipe(sass())
    //     .pipe(gulp.dest('build/css'));
    return gulp.src('source/scss/style.scss')
        .pipe(sass())
        .pipe(cssbeautify())
        .pipe(gulp.dest('build/css'));
});

//copy files

gulp.task('copy', function () {
    gulp.src('source/js/**/*.js').pipe(gulp.dest('build/js'));
    gulp.src('source/images/**/*').pipe(gulp.dest('build/images'));
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
        helpers: {
            compare: function (lvalue, rvalue, options) {

                if (arguments.length < 3)
                    throw new Error("Handlerbars Helper 'compare' needs 2 parameters");

                var operator = options.hash.operator || "==";

                var operators = {
                    '==': function (l, r) {
                        return l == r;
                    },
                    '===': function (l, r) {
                        return l === r;
                    },
                    '!=': function (l, r) {
                        return l != r;
                    },
                    '<': function (l, r) {
                        return l < r;
                    },
                    '>': function (l, r) {
                        return l > r;
                    },
                    '<=': function (l, r) {
                        return l <= r;
                    },
                    '>=': function (l, r) {
                        return l >= r;
                    },
                    'typeof': function (l, r) {
                        return typeof l == r;
                    }
                }

                if (!operators[operator])
                    throw new Error("Handlerbars Helper 'compare' doesn't know the operator " + operator);

                var result = operators[operator](lvalue, rvalue);

                if (result) {
                    return options.fn(this);
                } else {
                    return options.inverse(this);
                }

            }
        }
    }
    return gulp.src('source/pages/*.html').pipe(handlebars(templateData, options)).pipe(htmlbeautify({
        indent_size: 4
    })).pipe(gulp.dest('build'));
});

gulp.task('default', function (callback) {
    runSequence(['build', 'server', 'watch'], callback);
});