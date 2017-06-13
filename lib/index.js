'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _postcss = require('postcss');

var _postcss2 = _interopRequireDefault(_postcss);

var _checkin = require('checkin');

var _checkin2 = _interopRequireDefault(_checkin);

var _lint = require('./lint');

var _lint2 = _interopRequireDefault(_lint);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var REG_EXP = /\b(\d+(\.\d+)?)px\b/g;

function pxrem() {
  var opt = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
  var root = arguments[1];

  var option = (0, _checkin2.default)(opt, _lint2.default);
  var handle = transform(option);
  root.walkDecls(handle);

  return root;
}

function transform(opt) {
  var root = opt.root,
      filter = opt.filter,
      fixed = opt.fixed,
      keepPx = opt.keepPx,
      commentFilter = opt.commentFilter;


  var isFunction = typeOf(filter) === 'function';
  var isRegExp = typeOf(filter) === 'regexp';

  return function (decl) {
    var prop = decl.prop,
        value = decl.value;

    var possibleCommentNode = [decl.next(), // comment after declaration
    decl.parent.prev(), // comment before rule
    decl.parent.nodes[0] // comment right after rule
    ];

    // ignore situation
    if (!value.includes('px')) {
      return;
    } else if (isFunction && filter(prop, value, decl)) {
      return;
    } else if (isRegExp && filter.test(prop)) {
      return;
    } else if (possibleCommentNode.some(function (node) {
      return node && node.type === 'comment' && node.text === commentFilter;
    })) {
      return;
    }

    var replaceWithRem = revise({ root: root, fixed: fixed }, value);
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
  var root = option.root,
      fixed = option.fixed;


  return str.replace(REG_EXP, function (_, $1) {
    var count = parseFloat(($1 / root).toFixed(fixed));
    return count + 'rem';
  });
}

exports.default = _postcss2.default.plugin('pxrem', function (opt) {
  return pxrem.bind(null, opt);
});