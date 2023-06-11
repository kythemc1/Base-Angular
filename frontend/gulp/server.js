'use strict';

var path = require('path');
var gulp = require('gulp');
var conf = require('./conf');

var browserSync = require('browser-sync');
var browserSyncSpa = require('browser-sync-spa');

var util = require('util');

//var proxyMiddleware = require('http-proxy-middleware');

function browserSyncInit(baseDir, browser) {
  browser = browser === undefined ? 'default' : browser;

  //var routes = null;
  //if (baseDir === conf.paths.src || (util.isArray(baseDir) && baseDir.indexOf(conf.paths.src) !== -1)) {
  //  routes = {
  //    '/bower_components': 'bower_components'
  //  };
  //}

  var server = {
    baseDir: baseDir,
    //routes: routes,
    middleware: function (req, res, next) {
      //res.setHeader('Access-Control-Allow-Origin', '*');
      next();
    }
  };

  //console.log("baseDir:"+baseDir);

  var options = {
    target: 'http://www.example.org', // target host
    changeOrigin: true,               // needed for virtual hosted sites
    ws: true,                         // proxy websockets
    pathRewrite: {
      '^/api/old-path': '/api/new-path',     // rewrite path
      '^/api/remove/path': '/path'           // remove base path
    },
    router: {
      // when request.headers.host == 'dev.localhost:3000',
      // override target 'http://www.example.org' to 'http://localhost:8000'
      'dev.localhost:3003': 'http://localhost:8000'
    }
  };

  browserSync.instance = browserSync.init({
    startPath: '/',
    server: server,
    browser: browser,
    port: 23693
  });
}

browserSync.use(browserSyncSpa({
  selector: '[ng-app]'// Only needed for angular apps
}));

gulp.task('serve', ['watch'], function () {
  browserSyncInit([path.join(conf.paths.tmp, '/serve'), conf.paths.src]);
});

gulp.task('serve:dist', ['build'], function () {
  browserSyncInit(conf.paths.dist);
});

gulp.task('serve:e2e', ['inject'], function () {
  browserSyncInit([conf.paths.tmp + '/serve', conf.paths.src], []);
});

gulp.task('serve:e2e-dist', ['build'], function () {
  browserSyncInit(conf.paths.dist, []);
});
