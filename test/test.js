'use strict';

var noop = require('nop');
var assignFile = require('../');
var test = require('tape');

test('assignFile()', function(t) {
  t.plan(14);

  var obj = {};
  assignFile(obj, '.gitattributes', 'utf8', function(err, res) {
    t.deepEqual(
      [err, res],
      [null, {'.gitattributes': '* text=auto\n'}],
      'should set property based on the file name, contents and encoding.'
    );
    t.strictEqual(obj, res, 'should overwrite the target object.');
  });

  assignFile({'.gitattributes': ['a']}, '.gitattributes', null, function(err, res) {
    t.deepEqual(
      [err, res],
      [null, {'.gitattributes': new Buffer('* text=auto\n')}],
      'should override existing property.'
    );
  });

  assignFile({}, 'test/fixtures/a.txt', {}, function(err, res) {
    t.deepEqual(
      [err, res],
      [null, {test: {fixtures: {a: new Buffer('foo\n')}}}],
      'should set nested property when the file is under some directories.'
    );
  });

  assignFile({test: {fixtures: 1}}, 'test/fixtures/a.txt', function(err, res) {
    t.deepEqual(
      [err, res],
      [null, {test: {fixtures: {a: new Buffer('foo\n')}}}],
      'should overwrite the property if needed.'
    );
  });

  assignFile({}, 'fixtures/a.txt', {
    cwd: 'test',
    base: 'fixtures',
    encoding: 'base64'
  }, function(err, res) {
    t.deepEqual(
      [err, res],
      [null, {a: new Buffer('foo\n').toString('base64')}],
      'should reflect `cwd` option and `base` option to the result.'
    );
  });

  assignFile({}, '.gitattributes', {base: 'test'}, function(err, res) {
    t.deepEqual(
      [err, res],
      [null, {'..': {'.gitattributes': new Buffer('* text=auto\n')}}],
      'should set ".." property when the path starts with "../".'
    );
  });

  var option = {processor: Boolean};

  assignFile({}, 'index.js', option, function(err, res) {
    t.deepEqual(
      [err, res],
      [null, {index: true}],
      'should process file content with a function using `processor` option.'
    );
    t.deepEqual(option, {processor: Boolean}, 'should not modify option object.');
  });

  assignFile({}, 'test/fixtures/a.txt', {ext: true}, function(err, res) {
    t.deepEqual(
      [err, res],
      [null, {test: {fixtures: {'a.txt': new Buffer('foo\n')}}}],
      'should add extension to the property name using `ext` option.'
    );
  });

  assignFile({}, 'node_modules', function(err) {
    t.equal(
      err.code,
      'EISDIR',
      'should pass an error to the callback when it fails to read a file.'
    );
  });

  t.throws(
    assignFile.bind(null, null, '.gitattributes', noop),
    /TypeError/,
    'should throw a type error when the first argument is null or undefined.'
  );

  t.throws(
    assignFile.bind(null, {}, '/', noop),
    /must be a relative path/,
    'should throw an error when the path is absolute.'
  );

  t.throws(
    assignFile.bind(null, {}, '.gitattributes', {}),
    /TypeError.*must be a function/,
    'should throw a type error when the last argument is not a function.'
  );
});
