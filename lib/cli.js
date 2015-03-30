#!/usr/bin/env node

'use strict';

var fs = require('vinyl-fs'),
  chalk = require('chalk'),
  map = require('vinyl-map'),
  concat = require('gulp-concat'),
  ignore = require('gulp-ignore'),
  wrap = require('./wrap-queries'),
  argv = require('yargs')
    .alias('v', 'verbose')
    .alias('o', 'output')
    .usage('Usage: $0 input1.css [input2.css ...] [-v] [-o outputfile.css]')
    .argv,
  globs = argv._,
  outputFile = argv.output || 'styles.css',
  stream;

global.isVerbose = !!argv.verbose;

/**
 * write css to the console
 */
 function writeCSS() {
  return map(function (contents) {
    process.stdout.write(contents.toString());
    return contents;
  });
}

// check to make sure we have some input globs
if (!globs || !globs.length) {
  console.log(chalk.red('WARNING:') + ' Input files required!');
} else {
  stream = fs.src(globs)
    .pipe(ignore.include(function (file) { return file.stat && file.stat.size; }))
    .pipe(wrap())
    .pipe(concat(outputFile));

  if (!argv.output) {
    stream.pipe(writeCSS());
  } else {
    stream.pipe(fs.dest('.'));
  }
}

