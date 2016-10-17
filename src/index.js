import postcss from 'postcss'
import fs from 'fs'

const defaultOption = {
  root: 75,
  filter: null,
  unitPrecision: 6,
  keepPix: true,
  output: null
}

function pxrem(content, opt) {
  let option = Object.assign({}, opt, defaultOption)
  return content
}

function wrap(opt) {
  return (content, extend) => pxrem(content, Object.assign({}, opt, extend))
}

pxrem.wrap = wrap

export default pxrem
