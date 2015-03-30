'use strict';
var fs = require('fs'),
  expect = require('chai').expect,
  exec = require('child_process').exec,
  bash = 'node lib/cli.js ',
  fixtures = process.cwd() + '/test/fixtures/',
  allCSS = fixtures + 'all.css',
  allCSSContent = fs.readFileSync(allCSS).toString(),
  emptyCSS = fixtures + 'empty.css';

describe('calling from cli', function () {
  it('allows single glob to be passed in', function (done) {
    var cmd = bash + allCSS;

    exec(cmd, function (err, stdout) {
      expect(stdout).to.eql(allCSSContent);
      done();
    });
  });

  it('allows multiple globs to be passed in', function (done) {
    var cmd = bash + allCSS + ' ' + allCSS;

    exec(cmd, function (err, stdout) {
      expect(stdout).to.eql(allCSSContent);
      done();
    });
  });

  it('removed empty files', function (done) {
    var cmd = bash + allCSS + ' ' + emptyCSS;

    exec(cmd, function (err, stdout) {
      expect(stdout).to.eql(allCSSContent);
      done();
    });
  });

  it('writes file if passed --output', function (done) {
    var tmpCSS = 'test/tmp/output.css',
      cmd = bash + allCSS + ' --output ' + tmpCSS;

    exec(cmd, function () {
      var tmpCSSContent = fs.readFileSync(tmpCSS).toString();
      expect(tmpCSSContent).to.eql(allCSSContent);
      done();
    });
  });
});