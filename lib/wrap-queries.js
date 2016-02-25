'use strict';
var map = require('vinyl-map'),
  path = require('path');

/**
 * check to see if css src violates css nesting rules
 * @param  {string}  src
 * @param  {string}  filename
 * @return {Boolean}
 */
function hasErrors(src, filename) {
  if (src.indexOf('@media') !== -1 || src.indexOf('@keyframes') !== -1) {
    // Existing @ rule in css. Prevent @ rule nesting.
    console.warn(filename + ' already contains @ rule; responsive filename ignored.');
    return true;
  } else {
    return false;
  }
}

/**
 * wrap media queries
 * @return {Stream}
 */
function wrap() {
  return map(function (contents, filename) {
    // ignore all non-css files. simply pass them through
    if (path.basename(filename).indexOf('.css') === -1) {
      return contents;
    } else {
      var name = path.basename(filename, '.css'),
        startingNumber = parseInt(name, 10),
        src = contents.toString(),
        endingNumber;

      if (name === 'print') {
        // e.g. print.css
        if (hasErrors(src, filename)) {
          return contents;
        } else {
          contents = new Buffer('\n@media print {\n' + src + '}');
        }
      } else if (!isNaN(startingNumber)) {
        if (hasErrors(src, filename)) {
          return contents;
        }

        if (name.indexOf('+') > -1) {
          // e.g. 1024+.css
          contents = new Buffer('\n@media screen and (min-width: ' + startingNumber + 'px) {\n' + src + '}');
        } else if (name.indexOf('-') > -1) {
          // e.e.g 600-1024.css
          endingNumber = name.substring(name.indexOf('-') + 1);
          contents = new Buffer('\n@media screen and (min-width: ' + startingNumber + 'px) and (max-width: ' + parseFloat(endingNumber - 0.1).toFixed(1) + 'px) {\n' + src + '}');
        }
      }

      // if the name is something else, like all.css, default.css, etc then return the contents as-is
      return contents;
    }
  });
}

module.exports = wrap;
