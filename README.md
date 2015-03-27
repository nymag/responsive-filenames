# filename-breakpoints
📚📲 _"Easy CSS Breakpoints"_

This module allows you to easily delineate media query breakpoints by file name. For example, say we have five files:

```
all.css
print.css
0-600.css
600-1024.css
1024+.css
```

With filename-breakpoints, you can write css in these files without worrying about cascading across media queries. The print stylesheet would be wrapped in `@media print`, and the various viewport stylesheets get wrapped in media queries based on their file name (hence `filename-breakpoints`).

To mitigate issues with older browsers and zooming, we use `em`s internally, so your 0-600 stylesheet will be wrapped in:

```css
@media screen and (min-width: 0em) and (max-width: 37.499em) {
  /* styles */
}
```

In plain English, this is equivalent to "zero pixels up to (but not including) 600 pixels". You can specify any viewport size, and even have overlapping viewports (e.g. if you have a mobile + tablet stylesheet, then some specific tablet fixes).

# Install

```
npm install --save filename-breakpoints
```

If you want to use it in your terminal, you can also install it globally.

# Usage

## Command line

```bash
filename-breakpoints input1.css [input2.css ...] [options]
```

You can pass a list of files or a glob pattern (or a list of glob patterns, if you want) into filename-breakpoints. These are all valid:

```bash
filename-breakpoints path/to/file1.css path/to/file2.css
filename-breakpoints css/*.css
filename-breakpoints css/*.css otherstyles/**
```

By default the compiled css will output to stdout. You can also pass `-o filename` (or `--output filename`) to write it to a file.

## In Node

```js
var fnbp = require('filename-breakpoints');
```

### Flexible file arguments

Filename-breakpoints is very flexible about the arguments you pass in. You can give it a glob or an array of globs, or even multiple file arguments. These are all valid:

```js
fnbp('path/to/file1.css');
fnbp(['path/to/file1.css', 'path/to/file2.css']);
fnbp('css/*.css');
fnbp('css/*.css', 'otherstyles/**');
```

You can pass the same file arguments into the asynchronous and synchronous functions.

**NOTE:** The order of the files/globs you pass in is preserved, but globs themselves (usually) rely on filename order. [Read more about globbing](https://www.npmjs.com/package/glob#glob-primer).

### Asynchronous

```js
var fnbp = require('filename-breakpoints');

fnbp('css/*.css', function (err, css) {
  if (!err) {
    // do something with the compiled css!
  }
});
```

### Synchronous

```js
var fnbp = require('filename-breakpoints'),
  css = fnbp.sync('css/*.css');
```

### But what about promises?

This module's async function follows node best practices, so you can easily promisify it with a library like [bluebird](https://github.com/petkaantonov/bluebird)

```js
var Promise = require('bluebird'),
  fnbp = Promise.promisify(require('filename-breakpoints'));

fnbp('css/*.css')
  .then(function (css) {
    // do something with the compiled css!
  })
  .catch(function (e) {
    // oh noes!
  });
```

## In Gulp (and other build tools)

If you pass a stream into filename-breakpoints, it'll compile each file individually and output them as another stream.

```js
var fnbp = require('filename-breakpoints');

gulp.src('**/*.css')
  .pipe(fnbp())
  .pipe(concat())
  .pipe(cssmin())
  .pipe(gulp.dest('compiled.css'));
```