# filename-breakpoints
Easy CSS Breakpoints

# Install

```
npm install --save filename-breakpoints
```

If you want to use it in your terminal, you can also install it globally.

# Usage

**NOTE:** The order of the files/globs you pass in is preserved, but globs themselves (usually) rely on filename order. [Read more about globbing](https://www.npmjs.com/package/glob#glob-primer).

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

By default the compiled css will output to stdout. You can also pass some arguments:

* `-o` or `--output` with a filename outputs a compiled css file
* `-v` or `--verbose` lets you know exactly what's going on _in excruciating detail_
* `-V` or `--version` prints version number and exits

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