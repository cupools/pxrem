'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _extends2 = require('babel-runtime/helpers/extends');

var _extends3 = _interopRequireDefault(_extends2);

var _assign = require('babel-runtime/core-js/object/assign');

var _assign2 = _interopRequireDefault(_assign);

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

var _assert = require('assert');

var _assert2 = _interopRequireDefault(_assert);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var defaultOption = {
  root: 75,
  filter: null,
  fixed: 6,
  keepPx: false,
  output: null,
  commentFilter: 'no'
};

function pxrem(content, opt) {
  var option = reviseOption(opt, defaultOption);
  var root = _postcss2.default.parse(content);
  var handle = transform(option);

  root.walkDecls(handle);

  var ret = root.toString();
  var output = option.output;


  if (output) {
    writeFile(output, ret);
  }

  return ret;
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

function writeFile(output, content) {
  var dirname = _path2.default.dirname(output);
  _mkdirp2.default.sync(dirname);
  _fs2.default.writeFileSync(output, content);
}

function typeOf(obj) {
  return Object.prototype.toString.call(obj).slice(8, -1).toLowerCase();
}

function reviseOption(opt, def) {
  var option = (0, _assign2.default)({}, def, opt);

  _assert2.default.ok(typeOf(option.root) === 'number', '`root` should be a number but get ' + typeOf(option.root));
  _assert2.default.ok(typeOf(option.fixed) === 'number', '`fixed` should be a number but get ' + typeOf(option.fixed));

  if (typeOf(option.filter) === 'string') {
    return (0, _extends3.default)({}, option, {
      filter: new RegExp(option.filter.replace(/^\/*|\/*$/g, ''))
    });
  }

  return option;
}

function wrap(opt) {
  return function (content, extend) {
    return pxrem(content, (0, _assign2.default)({}, opt, extend));
  };
}

pxrem.wrap = wrap;

exports.default = pxrem;