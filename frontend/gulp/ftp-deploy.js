'use strict';

var gulp = require('gulp');
var gutil = require('gulp-util');
var ftp = require('vinyl-ftp');

/** Configuration **/
var user1 = "frontend-management-test";
//var user2 = "frontend-management-test";

var password = "tmdt1234567";
var host = '125.212.202.64';
var port = 21;
var localFilesGlob = ['./dist/**/*','!./dist/libs/_conf.js'];
var remoteFolder = '/'


// helper function to build an FTP connection based on our configuration
function getFtpConnection() {
  var connection = {
    host: host,
    port: port,
    password: password,
    parallel: 5,
    log: gutil.log
  }

  var server = gutil.env.server;

  if (server != "test") {
    connection.user = user1;
  }
  else{
    connection.user = user2;
  }

  return ftp.create(connection);
}

/**
 * Deploy task.
 * Copies the new files to the server
 *
 * Usage: `FTP_USER=someuser FTP_PWD=somepwd gulp ftp-deploy`
 */
gulp.task('ftp-deploy',['rebuild'], function () {
  var conn = getFtpConnection();

  //base: copy các file trong thư mục gốc ./dist vào trong remoteFolder
  return gulp.src(localFilesGlob, { base: './dist', buffer: false })
      .pipe(conn.newer(remoteFolder)) // only upload newer files
      .pipe(conn.dest(remoteFolder));
});


/**
 * Watch deploy task.
 * Watches the local copy for changes and copies the new files to the server whenever an update is detected
 *
 * Usage: `FTP_USER=someuser FTP_PWD=somepwd gulp ftp-deploy-watch`
 */
gulp.task('ftp-deploy-watch',['rebuild'], function () {

  var conn = getFtpConnection();

  gulp.watch(localFilesGlob)
  .on('change', function (event) {
    console.log('Changes detected! Uploading file "' + event.path + '", ' + event.type);

    return gulp.src([event.path], { base: './dist', buffer: false })
      .pipe(conn.newer(remoteFolder)) // only upload newer files
      .pipe(conn.dest(remoteFolder))
    ;
  });
});
