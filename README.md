# assign-file

[![npm version](https://badge.fury.io/js/assign-file.svg)](https://www.npmjs.com/package/assign-file)
[![Build Status](https://travis-ci.com/shinnn/assign-file.svg?branch=master)](https://travis-ci.com/shinnn/assign-file)
[![Coverage Status](https://img.shields.io/coveralls/shinnn/assign-file.svg)](https://coveralls.io/r/shinnn/assign-file)

Assign file contents to the target object

```javascript
const assignFile = require('assign-file');

// foo/bar/baz.txt (Hello!)

assignFile({foo: {bar: 123}}, 'foo/bar/baz.txt', 'utf8', (err, res) => {
  if (err) {
    throw err;
  }

  res;
  /* =>
    {
      foo: {
        bar: {
          baz: 'Hello!'
        }
      }
    }; //=> true
  */
});
```

## Installation

[Use](https://docs.npmjs.com/cli/install) [npm](https://docs.npmjs.com/about-npm/).

```
npm install assign-file
```

## API

```javascript
const assignFile = require('assign-file');
```

### assignFile(*target*, *filePath* [, *options*], *callback*)

*target*: `Object`  
*filePath*: `string` (a relative file path)  
*options*: `Object` or `string` (file encoding)  
*callback*: `Function`

It asynchronously reads a file, then assigns the file contents to the target object as a property.

The names of the assigned properties are based on the file path. For example,

* `foo.txt` sets `foo` property.
* `foo/bar.txt` sets `foo.bar` property.
* `foo/bar/baz.qux.txt` sets `foo.bar['baz.qux']` property.
* `../foo/bar.txt` sets `['..'].foo.bar` property.
* `foo/../bar/baz.txt` sets `bar.baz` property.

```javascript
const {deepEqual} = require('assert');
const assignFile = require('assign-file');

const target = {
  fixtures: {
    foo: 'bar'
  }
};

assignFile(target, 'fixtures/images/00.jpg', (err, res) => {
  if (err) {
    throw err;
  }

  // Adds fixtures.images['00'] property to the target object.
  deepEqual(res, {
    fixtures: { // overrides fixtures.foo property
      images: {
        '00': <Buffer ... > // new property
      }
    }
  });
});
```

All options and callback function can be used in the same way as [set-property-from-file](https://github.com/shinnn/set-property-from-file#options). The only difference from [set-property-from-file](https://github.com/shinnn/set-property-from-file) is that *assign-file* always overwrites existing ones using [`Object.assign()`](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Object/assign).

## License

Copyright (c) 2014 - 2018 [Shinnosuke Watanabe](https://github.com/shinnn)

Licensed under [the MIT License](./LICENSE).
