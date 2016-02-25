'use strict';
var expect = require('chai').expect,
  sinon = require('sinon'),
  fs = require('fs'),
  vinyl = require('vinyl-fs'),
  path = require('path'),
  gutil = require('gulp-util'),
  wrap = require('./wrap-queries');

describe('wrap-queries', function () {
  var mock;

  beforeEach(function () {
    mock = sinon.mock(console);
  });

  afterEach(function () {
    mock.restore();
  });

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

  it('passes though stylesheets with existing @keyframes query', function (done) {
    var keyframesCSS = process.cwd() + '/test/fixtures/0-10.css';

    mock.expects('warn');

    vinyl.src(keyframesCSS)
      .pipe(wrap())
      .pipe(gutil.buffer(function (err, files) {
        expect(path.basename(files[0].path)).to.equal('0-10.css');
        expect(files[0].contents.toString()).to.eql(fs.readFileSync(keyframesCSS).toString());
        mock.verify(); // it should call console.warn
        done();
      }));
  });

  it('passes though stylesheets with existing @media query', function (done) {
    var mediaCSS = process.cwd() + '/test/fixtures/10-20.css';

    mock.expects('warn');

    vinyl.src(mediaCSS)
      .pipe(wrap())
      .pipe(gutil.buffer(function (err, files) {
        expect(path.basename(files[0].path)).to.equal('10-20.css');
        expect(files[0].contents.toString()).to.eql(fs.readFileSync(mediaCSS).toString());
        mock.verify(); // it should call console.warn
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
          '\n@media screen and (min-width: 1024px) {\n' +
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
          '\n@media screen and (min-width: 0px) and (max-width: 599.9px) {\n' +
          fs.readFileSync(xToYCSS).toString() +
          '}'
        );
        done();
      }));
  });
});
