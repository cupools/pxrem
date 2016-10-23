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
      fixed: 6,
      keepPx: false,
      output: null
    }

    pxrem('.a {width: 750px}', option).should.have.selector('.a')
      .and.decl('width', '10rem')

    pxrem('.a {margin: 15px 2rem}', option).should.have.selector('.a')
      .and.decl('margin', '0.2rem 2rem')

    pxrem('.a {background: url(123px) 75px 15px}', option).should.have.selector('.a')
      .and.decl('background', 'url(123px) 1rem 0.2rem')
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
    pxrem('.a {width: 100px; height: 750px;}', option).should.have.selector('.a')
      .and.decl('width', '100px')
      .and.decl('height', '10rem')
  })

  it('should work with filter regexp', function () {
    let option = {
      filter: /height/
    }
    pxrem('.a {width: 750px; height: 100px;}', option).should.have.selector('.a')
      .and.decl('width', '10rem')
      .and.decl('height', '100px')
  })

  it('should work with fixed', function () {
    let option = {
      fixed: 2
    }
    pxrem('.a {width: 100px;}', option).should.have.selector('.a')
      .and.decl('width', '1.33rem')
  })

  it('should work with keepPx', function () {
    let option = {
      keepPx: true
    }
    pxrem('.a {width: 750px;}', option).should.have.selector('.a')
      .and.decl('width', '10rem')
      .and.decl('width', '750px')
  })

  it('should work with output', function () {
    let output = 'test/tmp/style.css'
    let option = { output }
    pxrem('.a {width: 750px;}', option).should.have.selector('.a')
      .and.decl('width', '10rem')

    fs.readFileSync(output).should.have.selector('.a')
      .and.decl('width', '10rem')
  })

  it('should work with wrap', function () {
    let option = {
      fixed: 2
    }
    let handler = pxrem.wrap(option)

    handler('.a {width: 100px;}').should.have.selector('.a')
      .and.decl('width', '1.33rem')

    handler('.a {width: 100px;}', { fixed: 4 }).should.have.selector('.a')
      .and.decl('width', '1.3333rem')
  })
})
