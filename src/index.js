import postcss from 'postcss'
import mkdirp from 'mkdirp'
import path from 'path'
import fs from 'fs'

const defaultOption = {
  root: 75,
  filter: null,
  unitPrecision: 6,
  keepPix: true,
  output: null
}

function pxrem(content, opt) {
  let option = Object.assign({}, defaultOption, opt)
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

function writeFile(output, content) {
  let dirname = path.dirname(output)
  mkdirp.sync(dirname)
  fs.writeFileSync(output, content)
}

function transform(opt) {
  let { root, filter, unitPrecision, keepPix } = opt
  let isFunction = filter && filter.constructor === Function
  let isRegExp = filter && filter.constructor === RegExp

  return function (decl) {
    let { prop, value } = decl

    // ignore situation
    if (isFunction && !filter(prop, value, decl)) {
      return
    } else if (isRegExp && filter.test(prop)) {
      return
    } else if (value.slice(-2) !== 'px') {
      return
    }

    let count = Number(value.slice(0, -2))
    let revise = Number((count / root).toFixed(unitPrecision))
    let expected = { value: revise + 'rem' }

    if (keepPix) {
      decl.cloneAfter(expected)
    } else {
      decl.replaceWith(decl.clone(expected))
    }
  }
}

function wrap(opt) {
  return (content, extend) => pxrem(content, Object.assign({}, opt, extend))
}

pxrem.wrap = wrap

export default pxrem
