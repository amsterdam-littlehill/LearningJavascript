let base = require('../src/base.js')
let expect = require('chai').expect
describe('base.js: ', function () {
  it('add() should work fine.', function () {
    expect(base.add(10)).to.equal(20)
  })
  it('multi() should work fine.', function () {
    expect(base.multi(10)).to.equal(100)
  })
  it('add() should work fine.', function () {
    let func = () => console.log('')
    expect(base.isFunc(func)).to.equal(true)

  })
})
