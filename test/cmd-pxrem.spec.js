/* eslint-env mocha */
/* eslint-disable import/no-extraneous-dependencies */

import { expect } from 'chai'
import './common'
import pxrem from '../src/cmd/pxrem'

describe('cmd - pxrem', function () {
  it('should work', function () {
    let option = {
      filename: 'test/fixtures/style.css'
    }

    pxrem(option).should.have.rule('.a')
      .and.decl('width', '1rem')
  })

  it('should exit when miss filename', function () {
    let option = {}
    expect(pxrem(option)).to.be.a('null')
  })

  it('should exit when filename not fount', function () {
    let option = {
      filename: 'undefiend.css'
    }
    expect(pxrem(option)).to.be.a('null')
  })
})