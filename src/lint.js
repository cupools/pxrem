export default {
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
    coerce(val) {
      return !!val
    }
  }
}
