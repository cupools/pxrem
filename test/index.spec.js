/* eslint-disable import/no-extraneous-dependencies */
/* eslint-env mocha */

import fs from 'fs'

import './common'
import pxrem from '../src/index'

describe('index', function () {
  it('should work', function () {
    let option = {
      root: 75,
      filter: null,
      unitPrecision: 6,
      keepPix: false,
      output: null
    }
    pxrem('.a {width: 750px}', option).should.have.selector('.a')
      .and.decl('width', '10rem')
  })

  it('should work with root', function () {
    let option = {
      root: 1000
    }
    pxrem('.a {width: 750px}', option).should.have.selector('.a')
      .and.decl('width', '0.75rem')
  })

  it('should work with filter function', function () {
    let option = {
      filter: decl => String.includes(decl, 'width')
    }
    pxrem('.a {width: 750px; height: 100px;}', option).should.have.selector('.a')
      .and.decl('width', '10rem')
      .and.decl('height', '100px')
  })

  it('should work with filter regexp', function () {
    let option = {
      filter: /height/
    }
    pxrem('.a {width: 750px; height: 100px;}', option).should.have.selector('.a')
      .and.decl('width', '10rem')
      .and.decl('height', '100px')
  })

  it('should work with unitPrecision', function () {
    let option = {
      unitPrecision: 2
    }
    pxrem('.a {width: 100px;}', option).should.have.selector('.a')
      .and.decl('width', '1.33rem')
  })

  it('should work with keepPix', function () {
    let option = {
      keepPix: true
    }
    pxrem('.a {width: 750px;}', option).should.have.selector('.a')
      .and.decl('width', '10rem')
      // .and.decl('width', '100rem')
  })

  it('should work with output', function () {
    let output = 'test/tmp/style.css'
    let option = { output }
    pxrem('.a {width: 750px;}', option).should.have.selector('.a')
      .and.decl('width', '10rem')

    fs.readFileSync(output).should.have.selector('.a')
      .and.decl('width', '10rem')
  })
})
