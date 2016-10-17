/* eslint-disable import/no-extraneous-dependencies */
/* eslint-env mocha */

import './common'
import pxrem from '../src/index'

describe('index', function () {
  it('should work', function () {
    pxrem('.a {width: 100px}').should.have.selector('.a')
      .and.decl('width', '100px')
  })
})
