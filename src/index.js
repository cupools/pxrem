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
  let option = reviseOption(defaultOption, opt)
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

function reviseOption(def, opt = {}) {
  let option = {
    ...def,
    ...opt,
    root: opt.root != null ? Number(opt.root) : def.root,
    fixed: opt.fixed != null ? Number(opt.fixed) : def.fixed,
    filter: typeOf(opt.filter) === 'string'
      ? new RegExp(opt.filter.replace(/^\/*|\/*$/g, ''))
      : (opt.filter || def.filter)
  }

  assert.ok(
    typeOf(option.root) === 'number' && isFinite(option.root),
    '`root` should be a number but get ' + opt.root
  )
  assert.ok(
    typeOf(option.fixed) === 'number' && isFinite(option.fixed),
    '`fixed` should be a number but get ' + opt.fixed
  )
  assert.ok(
    option.filter == null || typeOf(option.filter) === 'function' || typeOf(option.filter) === 'regexp',
    '`fixed` should be a string, regexp or function but get ' + opt.filter
  )
  assert.ok(
    option.output == null || typeOf(option.output) === 'string',
    '`output` should be a string but get ' + opt.output
  )
  assert.ok(
    option.commentFilter == null || typeOf(option.commentFilter) === 'string',
    '`commentFilter` should be a string but get ' + opt.commentFilter
  )

  return option
}


function writeFile(output, content) {
  let dirname = path.dirname(output)
  mkdirp.sync(dirname)
  fs.writeFileSync(output, content)
}

function typeOf(obj) {
  return Object.prototype.toString.call(obj).slice(8, -1).toLowerCase()
}

function wrap(opt) {
  return (content, extend) => pxrem(content, Object.assign({}, opt, extend))
}

pxrem.wrap = wrap

export default pxrem
