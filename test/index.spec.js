/* eslint-env mocha */
/* eslint-disable import/no-extraneous-dependencies */

import { expect } from 'chai'
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

    pxrem('.a {width: 750px}', option).should.have.rule('.a')
      .and.decl('width', '10rem')

    pxrem('.a {margin: 15px 2rem}', option).should.have.rule('.a')
      .and.decl('margin', '0.2rem 2rem')

    pxrem('.a {background: url(123px) 75px 15px}', option).should.have.rule('.a')
      .and.decl('background', 'url(123px) 1rem 0.2rem')

    pxrem('@media (max-width: 600px) {.a {width: 75px;}}', option).should.have.atRule('media', '(max-width: 600px)')
      .and.rule('.a')
      .and.decl('width', '1rem')

    pxrem('@keyframes fade {from {width: 15px;} to {width: 30px;}}', option).should.have.atRule('keyframes', 'fade')
      .and.rule('from')
      .and.decl('width', '0.2rem')
  })

  it('should work with root', function () {
    let option = {
      root: 1000
    }
    pxrem('.a {width: 750px}', option).should.have.rule('.a')
      .and.decl('width', '0.75rem')
  })

  it('should work with filter function', function () {
    let option = {
      filter: prop => String.includes(prop, 'width')
    }
    pxrem('.a {width: 100px; height: 750px;}', option).should.have.rule('.a')
      .and.decl('width', '100px')
      .and.decl('height', '10rem')
  })

  it('should work with filter regexp', function () {
    let option = {
      filter: /height/
    }
    pxrem('.a {width: 750px; height: 100px;}', option).should.have.rule('.a')
      .and.decl('width', '10rem')
      .and.decl('height', '100px')
  })

  it('should work with fixed', function () {
    let option = {
      fixed: 2
    }
    pxrem('.a {width: 100px;}', option).should.have.rule('.a')
      .and.decl('width', '1.33rem')
  })

  it('should work with keepPx', function () {
    let option = {
      keepPx: true
    }
    pxrem('.a {width: 750px;}', option).should.have.rule('.a')
      .and.decl('width', '10rem')
      .and.decl('width', '750px')
  })

  it('should work with comment', function () {
    let option = {
      commentFilter: 'bye'
    }

    pxrem('.a {width: 10px; /*bye*/}', option).should.have.rule('.a')
      .and.decl('width', '10px')
    pxrem('.a {width: 10px; /*no*/}').should.have.rule('.a')
      .and.decl('width', '10px')
    pxrem('.a {width: 10px; /* no */ height: 75px }').should.have.rule('.a')
      .and.decl('width', '10px')
      .and.decl('height', '1rem')
  })

  it('should work with output', function () {
    let output = 'test/tmp/style.css'
    let option = { output }
    pxrem('.a {width: 750px;}', option).should.have.rule('.a')
      .and.decl('width', '10rem')

    fs.readFileSync(output).should.have.rule('.a')
      .and.decl('width', '10rem')
  })

  it('should work with wrap', function () {
    let option = {
      fixed: 2
    }
    let handler = pxrem.wrap(option)

    handler('.a {width: 100px;}').should.have.rule('.a')
      .and.decl('width', '1.33rem')

    handler('.a {width: 100px;}', { fixed: 4 }).should.have.rule('.a')
      .and.decl('width', '1.3333rem')
  })

  it('should exit for fail assert `root`', function () {
    expect(function () {
      pxrem('', { root: {} })
    }).to.throw(Error)

    expect(function () {
      pxrem('', { root: NaN })
    }).to.throw(Error)
  })

  it('should exit for fail assert `fixed`', function () {
    expect(function () {
      pxrem('', { fixed: {} })
    }).to.throw(Error)

    expect(function () {
      pxrem('', { fixed: NaN })
    }).to.throw(Error)
  })

  it('should exit for fail assert `filter`', function () {
    expect(function () {
      pxrem('', { filter: {} })
    }).to.throw(Error)

    expect(function () {
      pxrem('', { filter: 1 })
    }).to.throw(Error)
  })

  it('should exit for fail assert `output`', function () {
    expect(function () {
      pxrem('', { output: {} })
    }).to.throw(Error)

    expect(function () {
      pxrem('', { output: 1 })
    }).to.throw(Error)
  })

  it('should exit for fail assert `commentFilter`', function () {
    expect(function () {
      pxrem('', { commentFilter: {} })
    }).to.throw(Error)

    expect(function () {
      pxrem('', { commentFilter: 1 })
    }).to.throw(Error)
  })
})
