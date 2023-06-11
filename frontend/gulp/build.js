'use strict';

var path = require('path');
var gulp = require('gulp');
var conf = require('./conf');
var gulpMerge = require('gulp-merge');

var $ = require('gulp-load-plugins')({
  pattern: ['gulp-*', 'main-bower-files', 'uglify-save-license', 'del']
});

gulp.task('partials', function () {
  return gulp.src([
      path.join(conf.paths.src, '/app/**/*.html'),
      path.join(conf.paths.tmp, '/serve/app/**/*.html')
    ])
    .pipe($.htmlmin({
      removeEmptyAttributes: true,
      removeAttributeQuotes: true,
      collapseBooleanAttributes: true,
      collapseWhitespace: true
    }))
    .pipe($.angularTemplatecache('templateCacheHtml.js', {
      module: 'MyApp',
      root: '/app'
    }))

    .pipe(gulp.dest(conf.paths.tmp + '/partials/'));
});

gulp.task('html', ['inject', 'partials'], function () {
  var partialsInjectFile = gulp.src(path.join(conf.paths.tmp, '/partials/templateCacheHtml.js'), {
    read: false
  });
  var partialsInjectOptions = {
    starttag: '<!-- inject:partials -->',
    ignorePath: path.join(conf.paths.tmp, '/partials'),
    addRootSlash: true
  };

  var htmlFilter = $.filter('*.html', {
    restore: true
  });
  var jsFilter = $.filter('**/*.js', {
    restore: true
  });
  var cssFilter = $.filter('**/*.css', {
    restore: true
  });

  return gulp.src(path.join(conf.paths.tmp, '/serve/*.html'))
    .pipe($.inject(partialsInjectFile, partialsInjectOptions))
    .pipe($.useref())
    .pipe(jsFilter)
    .pipe($.sourcemaps.init())
    // .pipe($.ngAnnotate())

    //.pipe($.uglify({ preserveComments: $.uglifySaveLicense })).on('error', conf.errorHandler('Uglify'))
    .pipe($.rev())
    .pipe($.sourcemaps.write('maps'))
    .pipe(jsFilter.restore)
    .pipe(cssFilter)
    // .pipe($.sourcemaps.init())
    //.pipe($.replace('../../bower_components/bootstrap-sass/assets/fonts/bootstrap/', '../fonts/'))
    //.pipe($.replace('../../bower_components/bootstrap-sass/assets/fonts/bootstrap/', '../fonts/'))

    //.pipe($.replace('src/assets/global/plugins/font-awesome/fonts/', '/fonts/'))

    .pipe($.cssnano({
      zindex: false
    }))
    .pipe($.rev())
    // .pipe($.sourcemaps.write('maps'))
    .pipe(cssFilter.restore)
    .pipe($.revReplace())
    .pipe(htmlFilter)
    .pipe($.htmlmin({
      removeEmptyAttributes: true,
      removeAttributeQuotes: true,
      collapseBooleanAttributes: true,
      collapseWhitespace: true
    }))
    .pipe(htmlFilter.restore)
    .pipe(gulp.dest(path.join(conf.paths.dist, '/')))
    .pipe($.size({
      title: path.join(conf.paths.dist, '/'),
      showFiles: true
    }));
});

// Only applies for fonts from bower dependencies
// Custom fonts are handled by the "other" task
gulp.task('fonts', function () {
  //return gulp.src(['src/assets/global/**/*'])
  //  .pipe($.filter('**/*.{eot,otf,svg,ttf,woff,woff2}'))
  //  .pipe($.flatten())
  //  .pipe(gulp.dest(path.join(conf.paths.dist, '/fonts/')));


  //var fileFilter = $.filter(function (file) {
  //  return file.stat.isFile();
  //});

  var bootstrap = gulp.src([
      //path.join(conf.paths.src, '/**/*'),
      //path.join('!' + conf.paths.src, '/**/*.{html,css,js,scss}'),
      path.join(conf.paths.src, '*assets/global/plugins/bootstrap/fonts/bootstrap/**/*'),
    ], {
      'base': '.'
    })
    .pipe($.filter('**/*.{eot,otf,svg,ttf,woff,woff2}'))
    .pipe($.flatten())
    //.pipe(fileFilter)
    .pipe(gulp.dest(path.join(conf.paths.dist, '/assets/global/plugins/bootstrap/fonts/bootstrap/')));

  var datatable = gulp.src([
      path.join(conf.paths.src, '/assets/global/plugins/datatables/images/*'),
    ])
    .pipe(gulp.dest(path.join(conf.paths.dist, '/assets/global/plugins/datatables/images/')));


  return gulpMerge(bootstrap, datatable);

  //return gulp.src($.mainBowerFiles())
  //  .pipe($.filter('**/*.{eot,otf,svg,ttf,woff,woff2}'))
  //  .pipe($.flatten())
  //  .pipe(gulp.dest(path.join(conf.paths.dist, '/fonts/')));


});

gulp.task('other', function () {
  var fileFilter = $.filter(function (file) {
    return file.stat.isFile();
  });

  return gulp.src([
      path.join(conf.paths.src, '/**/*'),

      path.join('!' + conf.paths.src, '/**/*.{html,css,js,scss}'),
      path.join('!' + conf.paths.src, '/assets/global/plugins/**/*'),
    ])
    .pipe(fileFilter)
    .pipe(gulp.dest(path.join(conf.paths.dist, '/')));
});

gulp.task('copyFolders', function () {

  var copyScripts = gulp.src([
      path.join(conf.paths.src, '/scripts/**/*'),
    ])
    .pipe(gulp.dest(path.join(conf.paths.dist, '/scripts')));

  var copyLibs = gulp.src([
      path.join(conf.paths.src, '/libs/*'),
    ])
    .pipe(gulp.dest(path.join(conf.paths.dist, '/libs/')));

  //var copyConf = gulp.src([
  //  path.join(conf.paths.src, '/_conf.js'),
  //])
  //.pipe(gulp.dest(path.join(conf.paths.dist, '/')));

  return gulpMerge(copyLibs, copyScripts);
});

gulp.task('clean', function () {

  return $.del.sync(
    [
      path.join(conf.paths.dist, '/**'),
      "!" + path.join(conf.paths.dist, '/App_Data/**'),
      path.join(conf.paths.tmp, '/')

    ], {
      nodir: true,
      force: true
    });
});

gulp.task('build', ['html', 'other', 'copyFolders', 'fonts']);

gulp.task('rebuild', ['clean', 'build']);
