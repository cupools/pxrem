import fs from 'fs'
import pxrem from '../index'

export default function (argvs) {
  let { filename, ...option } = argvs

  return lint(filename)
    ? pxrem(fs.readFileSync(filename), option)
    : null
}

function lint(filename) {
  if (!filename) {
    log('  error: miss `filename`')
    return false
  }
  if (!fs.existsSync(filename)) {
    log('  error: %s not found', filename)
    return false
  }
  return true
}

function log(...args) {
  /* istanbul ignore next */
  if (process.env.NODE_ENV !== 'testing') {
    // eslint-disable-next-line no-console
    console.log(...args)
  }
}
