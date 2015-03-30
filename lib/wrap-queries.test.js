'use strict';
var expect = require('chai').expect,
  fs = require('fs'),
  vinyl = require('vinyl-fs'),
  path = require('path'),
  gutil = require('gulp-util'),
  wrap = require('./wrap-queries');

describe('wrap-queries', function () {
  it('ignores non-css files', function (done) {
    var ignoreme = process.cwd() + '/test/fixtures/ignoreme.js';

    vinyl.src(ignoreme)
      .pipe(wrap())
      .pipe(gutil.buffer(function (err, files) {
        expect(path.basename(files[0].path)).to.equal('ignoreme.js');
        expect(files[0].contents.toString()).to.eql(fs.readFileSync(ignoreme).toString());
        done();
      }));
  });

  it('passes though stylesheets without media query names', function (done) {
    var allCSS = process.cwd() + '/test/fixtures/all.css';

    vinyl.src(allCSS)
      .pipe(wrap())
      .pipe(gutil.buffer(function (err, files) {
        expect(path.basename(files[0].path)).to.equal('all.css');
        expect(files[0].contents.toString()).to.eql(fs.readFileSync(allCSS).toString());
        done();
      }));
  });

  it('wraps print stylesheets', function (done) {
    var printCSS = process.cwd() + '/test/fixtures/print.css';

    vinyl.src(printCSS)
      .pipe(wrap())
      .pipe(gutil.buffer(function (err, files) {
        expect(path.basename(files[0].path)).to.equal('print.css');
        expect(files[0].contents.toString()).to.eql(
          '\n@media print {\n' + 
          fs.readFileSync(printCSS).toString() +
          '}'
        );
        done();
      }));
  });

  it('wraps x+.css stylesheets', function (done) {
    var xPlusCSS = process.cwd() + '/test/fixtures/1024+.css';

    vinyl.src(xPlusCSS)
      .pipe(wrap())
      .pipe(gutil.buffer(function (err, files) {
        expect(path.basename(files[0].path)).to.equal('1024+.css');
        expect(files[0].contents.toString()).to.eql(
          '\n@media screen and (min-width: 64.000em) {\n' + 
          fs.readFileSync(xPlusCSS).toString() +
          '}'
        );
        done();
      }));
  });

  it('wraps x-y.css stylesheets', function (done) {
    var xToYCSS = process.cwd() + '/test/fixtures/0-600.css';

    vinyl.src(xToYCSS)
      .pipe(wrap())
      .pipe(gutil.buffer(function (err, files) {
        expect(path.basename(files[0].path)).to.equal('0-600.css');
        expect(files[0].contents.toString()).to.eql(
          '\n@media screen and (min-width: 0.000em) and (max-width: 37.499em) {\n' + 
          fs.readFileSync(xToYCSS).toString() +
          '}'
        );
        done();
      }));
  });
});