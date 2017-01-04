import postcss from 'postcss'
import mkdirp from 'mkdirp'
import path from 'path'
import fs from 'fs'
import checkin from 'checkin'

import lint from './lint'

function pxrem(opt = {}, root) {
  const option = checkin(opt, lint)
  const handle = transform(option)
  root.walkDecls(handle)

  return root
}

function transform(opt) {
  const { root, filter, fixed, keepPx, commentFilter } = opt

  const isFunction = filter && typeOf(filter) === 'function'
  const isRegExp = filter && typeOf(filter) === 'regexp'

  return function (decl) {
    const { prop, value } = decl
    const nextNode = decl.next()

    // ignore situation
    if (isFunction && filter(prop, value, decl)) {
      return
    } else if (isRegExp && filter.test(prop)) {
      return
    } else if (!String.includes(decl, 'px') || postcss.list.space(value).every(val => val.slice(-2) !== 'px')) {
      return
    } else if (nextNode && nextNode.type === 'comment' && nextNode.text === commentFilter) {
      return
    }

    const replaceWithRem = postcss.list.space(value)
      .map(revise.bind(null, { root, fixed }))
      .join(' ')
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
  if (str.slice(-2) !== 'px') {
    return str
  }

  const { root, fixed } = option
  const count = Number(str.slice(0, -2)) / root
  const val = Number(count.toFixed(fixed)) + 'rem'
  return val
}

export default postcss.plugin('pxrem', opt => pxrem.bind(null, opt))
