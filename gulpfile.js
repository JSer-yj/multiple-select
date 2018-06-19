'use strict';
var gulp = require('gulp');
var rename = require('gulp-rename');
var uglify = require('gulp-uglify');
var minifyCss = require('gulp-minify-css');
var del = require('del');

gulp.task('script-dev', function() {
  return gulp.src('src/multiSelect.js')
    .pipe(gulp.dest('dist/'));
});

gulp.task('script-prod', function() {
  return gulp.src('src/multiSelect.js')
    .pipe(uglify())
    .pipe(rename('multiSelect.min.js'))
    .pipe(gulp.dest('dist/'));
});

gulp.task('style-dev', function() {
  return gulp.src('src/multiSelect.css')
    .pipe(gulp.dest('dist/'));
});

gulp.task('style-prod', function() {
  return gulp.src('src/multiSelect.css')
    .pipe(minifyCss())
    .pipe(rename('multiSelect.min.css'))
    .pipe(gulp.dest('dist/'));
});

gulp.task('clean', function() {
  return del(['dist/*']);
});

gulp.task('watch', function() {
  gulp.watch('src/multiSelect.js', ['script-dev']);
  gulp.watch('src/multiSelect.css', ['style-dev']);
});

gulp.task('default', ['style-dev','script-dev','watch']);

gulp.task('prod', ['clean','style-dev','script-dev','style-prod','script-prod']);