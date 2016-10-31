import postcss from 'postcss'
import mkdirp from 'mkdirp'
import path from 'path'
import fs from 'fs'
import assert from 'assert'

const defaultOption = {
  root: 75,
  filter: null,
  fixed: 6,
  keepPx: false,
  output: null,
  commentFilter: 'no'
}

function pxrem(content, opt) {
  let option = reviseOption(opt, defaultOption)
  let root = postcss.parse(content)
  let handle = transform(option)

  root.walkDecls(handle)

  let ret = root.toString()
  let { output } = option

  if (output) {
    writeFile(output, ret)
  }

  return ret
}

function transform(opt) {
  let { root, filter, fixed, keepPx, commentFilter } = opt

  let isFunction = filter && typeOf(filter) === 'function'
  let isRegExp = filter && typeOf(filter) === 'regexp'

  return function (decl) {
    let { prop, value } = decl
    let nextNode = decl.next()

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

    let replaceWithRem = postcss.list.space(value)
      .map(revise.bind(null, { root, fixed }))
      .join(' ')
    let expected = { value: replaceWithRem }

    if (keepPx) {
      decl.cloneAfter(expected)
    } else {
      decl.replaceWith(decl.clone(expected))
    }
  }
}

function revise(option, str) {
  if (str.slice(-2) !== 'px') {
    return str
  }

  let { root, fixed } = option
  let count = Number(str.slice(0, -2)) / root
  let val = Number(count.toFixed(fixed)) + 'rem'
  return val
}

function writeFile(output, content) {
  let dirname = path.dirname(output)
  mkdirp.sync(dirname)
  fs.writeFileSync(output, content)
}

function typeOf(obj) {
  return Object.prototype.toString.call(obj).slice(8, -1).toLowerCase()
}

function reviseOption(opt, def) {
  let option = Object.assign({}, def, opt)

  assert.ok(
    typeOf(option.root) === 'number',
    '`root` should be a number but get ' + typeOf(option.root)
  )
  assert.ok(
    typeOf(option.fixed) === 'number',
    '`fixed` should be a number but get ' + typeOf(option.fixed)
  )

  if (typeOf(option.filter) === 'string') {
    return {
      ...option,
      filter: new RegExp(option.filter.replace(/^\/*|\/*$/g, ''))
    }
  }

  return option
}

function wrap(opt) {
  return (content, extend) => pxrem(content, Object.assign({}, opt, extend))
}

pxrem.wrap = wrap

export default pxrem
