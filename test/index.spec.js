/* eslint-env mocha */
/* eslint-disable import/no-extraneous-dependencies */

import { expect } from 'chai'
import fs from 'fs'

import './common'
import pxrem from '../src/index'

describe('index', function () {
  it('should work', function () {
    const option = {
      root: 75,
      filter: null,
      fixed: 6,
      keepPx: false,
      output: null
    }

    pxrem.process('.a {width: 750px}', option).should.have.rule('.a')
      .and.decl('width', '10rem')

    pxrem.process('.a {margin: 15px 2rem}', option).should.have.rule('.a')
      .and.decl('margin', '0.2rem 2rem')

    pxrem.process('.a {background: url(123px) 75px 15px}', option).should.have.rule('.a')
      .and.decl('background', 'url(123px) 1rem 0.2rem')

    pxrem.process('@media (max-width: 600px) {.a {width: 75px;}}', option).should.have.atRule('media', '(max-width: 600px)')
      .and.rule('.a')
      .and.decl('width', '1rem')

    pxrem.process('@keyframes fade {from {width: 15px;} to {width: 30px;}}', option).should.have.atRule('keyframes', 'fade')
      .and.rule('from')
      .and.decl('width', '0.2rem')
  })

  it('should work with root', function () {
    const option = {
      root: 1000
    }
    pxrem.process('.a {width: 750px}', option).should.have.rule('.a')
      .and.decl('width', '0.75rem')
  })

  it('should work with filter function', function () {
    const option = {
      filter: prop => String.includes(prop, 'width')
    }
    pxrem.process('.a {width: 100px; height: 750px;}', option).should.have.rule('.a')
      .and.decl('width', '100px')
      .and.decl('height', '10rem')
  })

  it('should work with filter regexp', function () {
    const option = {
      filter: /height/
    }
    pxrem.process('.a {width: 750px; height: 100px;}', option).should.have.rule('.a')
      .and.decl('width', '10rem')
      .and.decl('height', '100px')
  })

  it('should work with fixed', function () {
    const option = {
      fixed: 2
    }
    pxrem.process('.a {width: 100px;}', option).should.have.rule('.a')
      .and.decl('width', '1.33rem')
  })

  it('should work with keepPx', function () {
    const option = {
      keepPx: true
    }
    pxrem.process('.a {width: 750px;}', option).should.have.rule('.a')
      .and.decl('width', '10rem')
      .and.decl('width', '750px')
  })

  it('should work with comment', function () {
    const option = {
      commentFilter: 'bye'
    }

    pxrem.process('.a {width: 10px; /*bye*/}', option).should.have.rule('.a')
      .and.decl('width', '10px')
    pxrem.process('.a {width: 10px; /*no*/}').should.have.rule('.a')
      .and.decl('width', '10px')
    pxrem.process('.a {width: 10px; /* no */ height: 75px }').should.have.rule('.a')
      .and.decl('width', '10px')
      .and.decl('height', '1rem')
  })

  it('should work with output', function () {
    const output = 'test/tmp/style.css'
    const option = { output }
    pxrem.process('.a {width: 750px;}', option).should.have.rule('.a')
      .and.decl('width', '10rem')

    fs.readFileSync(output).should.have.rule('.a')
      .and.decl('width', '10rem')
  })

  it('should exit for fail assert `root`', function () {
    return pxrem.process('', { root: {} }).should.be.rejected
  })

  it('should exit for fail assert `fixed`', function () {
    return pxrem.process('', { fixed: {} }).should.be.rejected
  })

  it('should exit for fail assert `filter`', function () {
    return pxrem.process('', { filter: {} }).should.be.rejected
  })

  it('should exit for fail assert `output`', function () {
    return pxrem.process('', { output: {} }).should.be.rejected
  })

  it('should exit for fail assert `commentFilter`', function () {
    return pxrem.process('', { commentFilter: {} }).should.be.rejected
  })
})
