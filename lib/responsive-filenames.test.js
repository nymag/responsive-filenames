'use strict';
var expect = require('chai').expect,
  fs = require('fs'),
  vinyl = require('vinyl-fs'),
  path = require('path'),
  fixtures = process.cwd() + '/test/fixtures/',
  gutil = require('gulp-util'),
  rfn = require('./responsive-filenames');

describe('calling from node', function () {

  it('allows streams to be passed in', function (done) {
    var allCSS = fixtures + 'all.css';

    vinyl.src(allCSS)
      .pipe(rfn())
      .pipe(gutil.buffer(function (err, files) {
        expect(path.basename(files[0].path)).to.equal('all.css');
        expect(files[0].contents.toString()).to.eql(fs.readFileSync(allCSS).toString());
        done();
      }));
  });

  it('allows single glob to be passed in', function (done) {
    var allCSS = fixtures + 'all.css';

    rfn(allCSS, function (err, css) {
      expect(css).to.eql(fs.readFileSync(allCSS).toString());
      done();
    });
  });

  it('allows array of globs to be passed in', function (done) {
    var allCSS = fixtures + 'all.css';

    rfn([allCSS, allCSS], function (err, css) {
      expect(css).to.eql(fs.readFileSync(allCSS).toString());
      done();
    });
  });

  it('allows multiple globs to be passed in', function (done) {
    var allCSS = fixtures + 'all.css';

    rfn(allCSS, allCSS, function (err, css) {
      expect(css).to.eql(fs.readFileSync(allCSS).toString());
      done();
    });
  });

  it('allows multiple arrays of globs to be passed in', function (done) {
    var allCSS = fixtures + 'all.css';

    rfn([allCSS, allCSS], [allCSS, allCSS], function (err, css) {
      expect(css).to.eql(fs.readFileSync(allCSS).toString());
      done();
    });
  });

  it('errors with globs if no callback is passed in', function () {
    var allCSS = fixtures + 'all.css',
      result = function () {
        return rfn(allCSS);
      };

    expect(result).to.throw('Callback required!');
  });

  it('removes empty files', function (done) {
    var allCSS = fixtures + 'all.css',
      emptyCSS = fixtures + 'empty.css';

    rfn([allCSS, emptyCSS], function (err, css) {
      expect(css).to.eql(fs.readFileSync(allCSS).toString());
      done();
    });
  });
});