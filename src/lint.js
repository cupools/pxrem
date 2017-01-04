export default {
  root: {
    default: 75,
    typeOf: 'number',
    coerce(val) {
      return val && Number(val)
    }
  },
  fixed: {
    default: 6,
    typeOf: 'number',
    coerce(val) {
      return val && Number(val)
    }
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
