# responsive-filenames
📚📲 _"Easy CSS Breakpoints"_

[![Build Status](https://travis-ci.org/nymag/responsive-filenames.svg)](https://travis-ci.org/nymag/responsive-filenames)
[![Code Climate](https://codeclimate.com/github/nymag/responsive-filenames/badges/gpa.svg)](https://codeclimate.com/github/nymag/responsive-filenames)

This module allows you to easily delineate media query breakpoints by file name. For example, say we have five files:

```
all.css
print.css
0-600.css
600-1024.css
1024+.css
```

With responsive-filenames, you can write css in these files without worrying about cascading across media queries. The print stylesheet will be wrapped in `@media print`, and the various viewport stylesheets get wrapped in media queries based on their file name (hence `responsive-filenames`).

To mitigate issues with older browsers and zooming, we use `em`s internally, so your 0-600 stylesheet will be wrapped in:

```css
@media screen and (min-width: 0px) and (max-width: 599.99px) {
  /* styles */
}
```

You can specify any viewport size, and even have overlapping viewports. For example, you can have a combined mobile and tablet stylesheet, and some separate tablet fixes:

```
0-1024.css
600-1024.css
```

# Install

```
npm install --save responsive-filenames
```

If you want to use it in your terminal, you can also install it globally.

# Usage

## Command line

```bash
responsive-filenames input1.css [input2.css ...] [options]
```

You can pass multiple files or glob patterns into responsive-filenames. These are all valid:

```bash
responsive-filenames path/to/file1.css
responsive-filenames css/*.css
responsive-filenames css/*.css otherstyles/**
```

By default the compiled css will output to stdout. You can also pass `-o filename` (or `--output filename`) to write it to a file.

## In Node

```js
var rfn = require('responsive-filenames');

rfn('css/*.css', function (err, css) {
  if (!err) {
    // do something with the compiled css!
  }
});
```

### Flexible file arguments

responsive-filenames is very flexible about the arguments you pass in. You can give it a glob or an array of globs, or even multiple file arguments. These are all valid:

```js
var callback = function (err, css) {
  if (!err) {
    // do something with the compiled css!
  }
};

rfn('path/to/file1.css', callback);
rfn(['path/to/file1.css', 'path/to/file2.css'], callback);
rfn('css/*.css', callback);
rfn('css/*.css', 'otherstyles/**', callback);
```

**NOTE:** The order of the files/globs you pass in is preserved, but globs themselves (usually) rely on filename order. [Read more about globbing](https://www.npmjs.com/package/glob#glob-primer).

### But what about promises?

This module's async function follows node best practices, so you can easily promisify it with a library like [bluebird](https://github.com/petkaantonov/bluebird)

```js
var Promise = require('bluebird'),
  rfn = Promise.promisify(require('responsive-filenames'));

rfn('css/*.css')
  .then(function (css) {
    // do something with the compiled css!
  })
  .catch(function (e) {
    // oh noes!
  });
```

## In Gulp (and other build tools)

If you pass a stream into responsive-filenames, it'll compile each file individually and output them as another stream.

```js
var rfn = require('responsive-filenames');

gulp.src('**/*.css')
  .pipe(rfn())
  .pipe(concat())
  .pipe(cssmin())
  .pipe(gulp.dest('compiled.css'));
```