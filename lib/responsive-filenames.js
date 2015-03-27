'use strict';
var _ = require('lodash'),
  fs = require('vinyl-fs'),
  map = require('vinyl-map'),
  concat = require('gulp-concat'),
  filter = require('through2-filter'),
  wrap = require('./wrap-queries'),
  notEmpty = filter.obj(function (file) {
    return file.stat && file.stat.size;
  });

module.exports = function () {
  var globs = _.flatten(_.dropRight(arguments)),
    callback = _.last(arguments);

  if (!arguments) {
    // a stream is being passed in!
    return wrap();
  } else if (_.isFunction(callback)) {
    // a node module is calling this normally
    return fs.src(globs)
      .pipe(notEmpty)
      .pipe(notEmpty)
      .pipe(wrap())
      .pipe(concat('styles'))
      .pipe(map(function (contents) {
        callback(contents);
        return contents;
      }));
  }
};

// module.exports.sync = function () {
//   var globs = _.flatten(arguments),
//     stream = fs.src(globs)
//       .pipe(notEmpty)
//       .pipe(notEmpty)
//       .pipe(wrap())
//       .pipe(concat('styles')),
//     contents = '';

//   stream.on('data', function (chunk) {
//     contents += chunk.toString();
//   });

//   stream.on('end', function () {

//   })
// }