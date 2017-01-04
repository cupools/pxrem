'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = {
  root: {
    default: 75,
    typeOf: 'number'
  },
  fixed: {
    default: 6,
    typeOf: 'number'
  },
  filter: {
    default: null,
    typeOf: ['function', 'regexp', 'null']
  },
  commentFilter: {
    default: 'no',
    typeOf: ['string']
  },
  keepPx: {
    default: false,
    coerce: function coerce(val) {
      return !!val;
    }
  }
};