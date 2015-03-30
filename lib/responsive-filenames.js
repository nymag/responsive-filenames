'use strict';
var _ = require('lodash'),
  fs = require('vinyl-fs'),
  concat = require('gulp-concat'),
  ignore = require('gulp-ignore'),
  wrap = require('./wrap-queries');

module.exports = function () {
  var globs, callback, css;

  if (!arguments.length) {
    // a stream is being passed in!
    return wrap();
  } else {
    // a node module is calling this normally
    globs = _.flatten(_.dropRight(arguments));
    callback = _.last(arguments);
    css = '';

    if (typeof callback !== 'function') {
      throw new Error('Callback required!');
    }

    return fs.src(globs)
      .pipe(ignore.include(function (file) { return file.stat && file.stat.size; }))
      .pipe(wrap())
      .pipe(concat('styles'))
      .on('data', function (file) {
        if (file && file.contents && file.contents.length) {
          css += file.contents.toString();
        }
      })
      .on('error', function (e) {
        callback(e);
      })
      .on('end', function () {
        callback(null, css);
      });
  }
};