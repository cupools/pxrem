import postcss from 'postcss'
import checkin from 'checkin'

import lint from './lint'

const REG_EXP = /\b(\d+(\.\d+)?)px\b/g

function pxrem(opt = {}, root) {
  const option = checkin(opt, lint)
  if (!option.enable) return root

  const handle = transform(option)
  root.walkDecls(handle)

  return root
}

function transform(opt) {
  const { root, filter, fixed, keepPx, commentFilter } = opt

  const isFunction = typeOf(filter) === 'function'
  const isRegExp = typeOf(filter) === 'regexp'

  return decl => {
    const { prop, value } = decl
    const nextNode = decl.next()

    // ignore situation
    if (!value.includes('px')) {
      return
    } else if (isFunction && filter(prop, value, decl)) {
      return
    } else if (isRegExp && filter.test(prop)) {
      return
    } else if (nextNode && nextNode.type === 'comment' && nextNode.text === commentFilter) {
      return
    }

    const replaceWithRem = revise({ root, fixed }, value)
    const expected = { value: replaceWithRem }

    if (keepPx) {
      decl.cloneAfter(expected)
    } else {
      decl.replaceWith(decl.clone(expected))
    }
  }
}

function typeOf(obj) {
  return Object.prototype.toString.call(obj).slice(8, -1).toLowerCase()
}

function revise(option, str) {
  const { root, fixed } = option

  return str.replace(REG_EXP, (_, $1) => {
    const count = parseFloat(($1 / root).toFixed(fixed))
    return count + 'rem'
  })
}

export default postcss.plugin('pxrem', opt => pxrem.bind(null, opt))
