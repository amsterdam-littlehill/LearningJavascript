let compose = require('../src/compose')
let base = require('../src/base.js')
let expect = require('chai').expect

describe('compose.js: ', function () {
  it('compose() equals.', function () {
    expect(compose.compose).to.throw(Error)
  })
  it('compose(add)(10) equals ', () => {
    expect(compose.compose(base.add)(10)).to.equal(20)
  })

  it('compose(multi, add, minus)(10) equals ', () => {
    expect(
      compose.compose(
        base.multi,
        base.add,
        base.minus,
      )(10),
    ).to.equal(100)
  })

  it('compose(multi, add, minus)(10) equals ', () => {
    expect(
      compose.compose(
        base.multi,
        base.add,
        base.minus,
      )(10),
    ).to.equal(100)
  })

  it('compose(minus, add, multi)(10) equals ', () => {
    expect(
      compose.compose(
        base.minus,
        base.add,
        base.multi,
      )(10),
    ).to.equal(100)
  })
})


