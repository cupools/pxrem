'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _includes = require('babel-runtime/core-js/string/includes');

var _includes2 = _interopRequireDefault(_includes);

var _postcss = require('postcss');

var _postcss2 = _interopRequireDefault(_postcss);

var _mkdirp = require('mkdirp');

var _mkdirp2 = _interopRequireDefault(_mkdirp);

var _path = require('path');

var _path2 = _interopRequireDefault(_path);

var _fs = require('fs');

var _fs2 = _interopRequireDefault(_fs);

var _checkin = require('checkin');

var _checkin2 = _interopRequireDefault(_checkin);

var _lint = require('./lint');

var _lint2 = _interopRequireDefault(_lint);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function pxrem() {
  var opt = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
  var root = arguments[1];

  var option = (0, _checkin2.default)(opt, _lint2.default);
  var handle = transform(option);
  root.walkDecls(handle);

  return root;
}

function transform(opt) {
  var root = opt.root;
  var filter = opt.filter;
  var fixed = opt.fixed;
  var keepPx = opt.keepPx;
  var commentFilter = opt.commentFilter;


  var isFunction = filter && typeOf(filter) === 'function';
  var isRegExp = filter && typeOf(filter) === 'regexp';

  return function (decl) {
    var prop = decl.prop;
    var value = decl.value;

    var nextNode = decl.next();

    // ignore situation
    if (isFunction && filter(prop, value, decl)) {
      return;
    } else if (isRegExp && filter.test(prop)) {
      return;
    } else if (!(0, _includes2.default)(decl, 'px') || _postcss2.default.list.space(value).every(function (val) {
      return val.slice(-2) !== 'px';
    })) {
      return;
    } else if (nextNode && nextNode.type === 'comment' && nextNode.text === commentFilter) {
      return;
    }

    var replaceWithRem = _postcss2.default.list.space(value).map(revise.bind(null, { root: root, fixed: fixed })).join(' ');
    var expected = { value: replaceWithRem };

    if (keepPx) {
      decl.cloneAfter(expected);
    } else {
      decl.replaceWith(decl.clone(expected));
    }
  };
}

function typeOf(obj) {
  return Object.prototype.toString.call(obj).slice(8, -1).toLowerCase();
}

function revise(option, str) {
  if (str.slice(-2) !== 'px') {
    return str;
  }

  var root = option.root;
  var fixed = option.fixed;

  var count = Number(str.slice(0, -2)) / root;
  var val = Number(count.toFixed(fixed)) + 'rem';
  return val;
}

exports.default = _postcss2.default.plugin('pxrem', function (opt) {
  return pxrem.bind(null, opt);
});