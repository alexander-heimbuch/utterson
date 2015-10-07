/* eslint-env node*/
'use strict';

var gulp = require('gulp'),
    eslint = require('gulp-eslint'),
    mocha = require('gulp-mocha');



gulp.task('lint', function () {
    return gulp.src('**/*.js')
        .pipe(eslint())
        .pipe(eslint.format());
});

gulp.task('test', function () {
    return gulp.src('**/*-test.js', {read: false})
        .pipe(mocha({reporter: 'nyan'}));
});

gulp.task('default', ['lint', 'test']);
