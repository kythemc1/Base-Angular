'use strict';

var path = require('path');
var gulp = require('gulp');
var conf = require('./conf');
var babel = require('gulp-babel');
var browserSync = require('browser-sync');

var $ = require('gulp-load-plugins')();

gulp.task('scripts-reload', function() {
  return buildScripts()
    .pipe(browserSync.stream());
});

gulp.task('scripts', function() {
  return buildScripts();
});

function buildScripts() {
  return gulp.src(path.join(conf.paths.src, '/app/**/*.js'))
    //.pipe(babel({
    //  presets: ['es2015']
    //}))
    .pipe($.eslint(
      {
        "rules": {
          "angular/controller-as-vm": 0,
          "angular/controller-as": 0,
          "angular/controller-as-route": 0,
          "angular/no-services": 0,
          "angular/controller-name": 0,
          "angular/angularelement": 0,
          "angular/module-getter": 0,
          "angular/on-watch": 0,
          "angular/timeout-service": 0,
          "angular/window-service": 0,
          "angular/json-functions": 0,
          "angular/di": 0,
          "angular/definedundefined": 0,
          "no-undef": 0,
          "no-undef-vars": 0,
          "no-unused-vars": 0,
          "no-mixed-spaces-and-tabs": 0
        }
      }
    ))
    //.pipe($.eslint.format())
    //.pipe($.size())
};
