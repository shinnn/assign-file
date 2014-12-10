/*!
 * assign-file | MIT (c) Shinnosuke Watanabe
 * https://github.com/shinnn/assign-file
*/
'use strict';

var objectAssign = require('object-assign');
var setPropertyFromFile = require('set-property-from-file');

module.exports = function assignFile(target, filePath, options, cb) {
  if (cb === undefined) {
    cb = options;
    options = {};
  }

  // Argument validation
  objectAssign(target);

  if (typeof cb !== 'function') {
    throw new TypeError(cb + ' is not a function. Last argument must be a function.');
  }

  setPropertyFromFile({}, filePath, options, function(err, source) {
    if (err) {
      cb(err);
      return;
    }

    cb(null, objectAssign(target, source));
  });
};
