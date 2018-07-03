var gulp = require('gulp'),
    concat = require('gulp-concat'),
    uglify = require('gulp-uglify'),
    rename = require('gulp-rename'),
    babel = require('gulp-babel'),
    browserify = require('gulp-browserify'),
    util = require('gulp-util'),
    sass = require('gulp-sass');

gulp.task('build-app', function () {
    return gulp.src('resources/js/app/**/*.js')
               .pipe(concat('bundle.js'))
               .pipe(browserify())
               .pipe(util.env.production ? babel({
                   presets: ['es2015']
               }) : util.noop())
               .pipe(util.env.production ? uglify() : util.noop())
               .pipe(rename({suffix: '.min'}))
               .pipe(gulp.dest('static/'));
});

gulp.task('build-editor', function () {
    return gulp.src('resources/js/editor/**/*.js')
               .pipe(concat('editor-bundle.js'))
               .pipe(browserify())
               .pipe(util.env.production ? babel({
                   presets: ['es2015']
               }) : util.noop())
               .pipe(util.env.production ? uglify() : util.noop())
               .pipe(rename({suffix: '.min'}))
               .pipe(gulp.dest('static/'));
});

gulp.task('build-all-editor-modes', function () {
    return gulp.src(['node_modules/codemirror/addon/mode/simple.js', 'node_modules/codemirror/mode/*/*.js'])
               .pipe(util.env.production ? uglify() : util.noop())
               .pipe(rename({suffix: '.min'}))
               .pipe(gulp.dest('static/codemirror'));
});

gulp.task('build-editor-vim-keymap-mode', function () {
    return gulp.src(['node_modules/codemirror/keymap/vim.js'])
               .pipe(util.env.production ? uglify() : util.noop())
               .pipe(rename({suffix: '.min'}))
               .pipe(gulp.dest('static/codemirror'));
});

gulp.task('build-sass', function () {
    return gulp.src(['resources/sass/**/*.scss', 'node_modules/codemirror/addon/dialog/dialog.css'])
               .pipe(concat('bundle.min.css'))
               .pipe(sass())
               .pipe(gulp.dest('static/'))
});

gulp.task('build', ['build-sass', 'build-app', 'build-all-editor-modes', 'build-editor-vim-keymap-mode'])