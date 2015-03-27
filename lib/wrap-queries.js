'use strict';
var map = require('vinyl-map'),
  path = require('path');

// util function for converting px breakpoints to ems
function pxToEm(px) {
  return parseFloat(px / 16).toFixed(3);
}

/**
 * wrap media queries
 * @return {Stream}
 */
function wrap() {
  return map(function (contents, filename) {
    var name = path.basename(filename, '.css'),
      startingNumber = parseInt(name, 10),
      src = contents.toString(),
      endingNumber;

    // e.g. print.css
    if (name === 'print') {
      contents = new Buffer('\n@media print {\n' + src + '}');
    } else if (!isNaN(startingNumber)) {
      if (name.indexOf('+') > -1) {
        // e.g. 1024+.css
        contents = new Buffer('\n@media screen and (min-width: ' + pxToEm(startingNumber) + 'em) {\n' + src + '}');
      } else if (name.indexOf('-') > -1) {
        // e.e.g 600-1024.css
        endingNumber = name.substring(name.indexOf('-') + 1);
        contents = new Buffer('\n@media screen and (min-width: ' + pxToEm(startingNumber) + 'em) and (max-width: ' + pxToEm(parseFloat(endingNumber - 0.01)) + 'em) {\n' + src + '}');
      }
    }
    // if the name is something else, like all.css, default.css, etc then return the contents as-is

    return contents;
  });
}

module.exports = wrap;