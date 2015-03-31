'use strict';
var map = require('vinyl-map'),
  path = require('path');

/**
 * check for existing @ rule in css to prevent @ rule nesting.
 * Throws error if found.
 */
function hasAtRule(css) {
  if (css.indexOf('@media') !== -1 || css.indexOf('@keyframes') !== -1) {
    throw new Error('CSS already contains @ rule; Can\'t be wrapped in additional media query.');
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

      // e.g. print.css
      if (name === 'print') {
        hasAtRule(src);
        contents = new Buffer('\n@media print {\n' + src + '}');
      } else if (!isNaN(startingNumber)) {
        hasAtRule(src);
        if (name.indexOf('+') > -1) {
          // e.g. 1024+.css
          contents = new Buffer('\n@media screen and (min-width: ' + startingNumber + 'px) {\n' + src + '}');
        } else if (name.indexOf('-') > -1) {
          // e.e.g 600-1024.css
          endingNumber = name.substring(name.indexOf('-') + 1);
          contents = new Buffer('\n@media screen and (min-width: ' + startingNumber + 'px) and (max-width: ' + parseFloat(endingNumber - 0.01).toFixed(2) + 'px) {\n' + src + '}');
        }
      }
      // if the name is something else, like all.css, default.css, etc then return the contents as-is

      return contents;
    }
  });
}

module.exports = wrap;
