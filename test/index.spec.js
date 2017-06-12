/* eslint-env mocha */

import './common'
import pxrem from '../src/index'

describe('index', () => {
  it('should work', () => {
    const option = {
      root: 75,
      filter: null,
      fixed: 6,
      keepPx: false
    }

    pxrem.process('.a {width: 750px}', option).should.have.rule('.a')
      .and.decl('width', '10rem')

    pxrem.process('.a {margin: 15px 2rem}', option).should.have.rule('.a')
      .and.decl('margin', '0.2rem 2rem')

    pxrem.process('.a {transform: translate(15px, 15px)}', option).should.have.rule('.a')
      .and.decl('transform', 'translate(0.2rem, 0.2rem)')

    pxrem.process('.a {background: url(data:img/jpg;base64,123px123) 75px 15px}', option).should.have.rule('.a')
      .and.decl('background', 'url(data:img/jpg;base64,123px123) 1rem 0.2rem')

    pxrem.process('@media (max-width: 600px) {.a {width: 75px;}}', option).should.have.atRule('media', '(max-width: 600px)')
      .and.rule('.a')
      .and.decl('width', '1rem')

    pxrem.process('@keyframes fade {from {width: 15px;} to {width: 30px;}}', option).should.have.atRule('keyframes', 'fade')
      .and.rule('from')
      .and.decl('width', '0.2rem')
  })

  it('should work with root', () => {
    const option = {
      root: 1000
    }
    pxrem.process('.a {width: 750px}', option).should.have.rule('.a')
      .and.decl('width', '0.75rem')
  })

  it('should work with filter function', () => {
    const option = {
      filter: prop => String.includes(prop, 'width')
    }
    pxrem.process('.a {width: 100px; height: 750px;}', option).should.have.rule('.a')
      .and.decl('width', '100px')
      .and.decl('height', '10rem')
  })

  it('should work with filter regexp', () => {
    const option = {
      filter: /height/
    }
    pxrem.process('.a {width: 750px; height: 100px;}', option).should.have.rule('.a')
      .and.decl('width', '10rem')
      .and.decl('height', '100px')
  })

  it('should work with fixed', () => {
    const option = {
      fixed: 2
    }
    pxrem.process('.a {width: 100px;}', option).should.have.rule('.a')
      .and.decl('width', '1.33rem')
  })

  it('should work with keepPx', () => {
    const option = {
      keepPx: true
    }
    pxrem.process('.a {width: 750px;}', option).should.have.rule('.a')
      .and.decl('width', '10rem')
      .and.decl('width', '750px')
  })

  it('should work with comment', () => {
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

  it('should be disabled', () => {
    const option = { enable: false }
    pxrem.process('.a {width: 10px;}', option).should.have.rule('.a')
      .and.decl('width', '10px')
  })
})
