let memoize = require('../src/memoize')
let expect = require('chai').expect

const fibnacci = i => {
  if (i === 0 || i === 1) {
    return 1
  }
  return fibnacci(i - 1) + fibnacci(i - 2)
}
describe('memoize.js: ', function () {
  it('fibnacci(30) to equal 1346269', () => {
    expect(fibnacci(30)).to.equal(1346269)
  })

  it('memoize fibnacci(30) to equal 1346269', () => {
    expect(memoize.memoization(fibnacci)(30)).to.equal(1346269)
  })

  it('memoize fibnacci(0) to equal 1', () => {
    expect(memoize.memoization(fibnacci)(0)).to.equal(1)
  })

  it('memoize fibnacci(1) to equal 1', () => {
    expect(memoize.memoization(fibnacci)(1)).to.equal(1)
  })

  it('memoize fibnacci(2) to equal 2', () => {
    expect(memoize.memoization(fibnacci)(2)).to.equal(2)
  })

})


