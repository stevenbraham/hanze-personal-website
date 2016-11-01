/**
 * Created by stevenbraham on 24-10-16.
 */
var gulp = require('gulp');
var connect = require('gulp-connect');
var fs = require('fs');
var plugins = require('gulp-load-plugins')({
    scope: ['devDependencies'],
    pattern: ['*']
});

gulp.task('images', function () {
    gulp.src('source/images/**/*.jpg').pipe(plugins.imagemin()).pipe(gulp.dest('build/images'));
});

gulp.task('sass', function () {
    // return gulp.src('source/scss/**/*.scss')
    //     .pipe(sass())
    //     .pipe(gulp.dest('build/css'));
    return gulp.src('source/scss/style.scss')
        .pipe(plugins.sass())
        .pipe(plugins.cssbeautify())
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
    return plugins.del.sync('build');
})

//webserver
gulp.task('server', function () {
    connect.server({root: "build"});
});

gulp.task('build', function (callback) {
    plugins.runSequence(['clean', 'sass', 'handlebars', 'copy', 'images'],
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
    return gulp.src('source/pages/*.html').pipe(plugins.compileHandlebars(templateData, options)).pipe(plugins.htmlBeautify({
        indent_size: 4
    })).pipe(gulp.dest('build'));
});

gulp.task('default', function (callback) {
    plugins.runSequence(['build', 'server', 'watch'], callback);
});