'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _assign = require('babel-runtime/core-js/object/assign');

var _assign2 = _interopRequireDefault(_assign);

var _postcss = require('postcss');

var _postcss2 = _interopRequireDefault(_postcss);

var _fs = require('fs');

var _fs2 = _interopRequireDefault(_fs);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var defaultOption = {
  root: 75,
  filter: null,
  unitPrecision: 6,
  keepPix: true,
  output: null
};

function pxrem(content, opt) {
  var option = (0, _assign2.default)({}, opt, defaultOption);
  return content;
}

function wrap(opt) {
  return function (content, extend) {
    return pxrem(content, (0, _assign2.default)({}, opt, extend));
  };
}

pxrem.wrap = wrap;

exports.default = pxrem;