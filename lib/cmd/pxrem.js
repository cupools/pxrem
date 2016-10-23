'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _objectWithoutProperties2 = require('babel-runtime/helpers/objectWithoutProperties');

var _objectWithoutProperties3 = _interopRequireDefault(_objectWithoutProperties2);

exports.default = function (argvs) {
  var filename = argvs.filename;
  var option = (0, _objectWithoutProperties3.default)(argvs, ['filename']);


  return lint(filename) ? (0, _index2.default)(_fs2.default.readFileSync(filename), option) : null;
};

var _fs = require('fs');

var _fs2 = _interopRequireDefault(_fs);

var _index = require('../index');

var _index2 = _interopRequireDefault(_index);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function lint(filename) {
  if (!filename) {
    log('  error: miss `filename`');
    return false;
  }
  if (!_fs2.default.existsSync(filename)) {
    log('  error: %s not found', filename);
    return false;
  }
  return true;
}

function log() {
  /* istanbul ignore next */
  if (process.env.NODE_ENV !== 'testing') {
    var _console;

    // eslint-disable-next-line no-console
    (_console = console).log.apply(_console, arguments);
  }
}