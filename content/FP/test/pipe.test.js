let pipe = require('../src/pipe')
let base = require('../src/base.js')
let expect = require('chai').expect

describe('pipe.js: ', function () {
  it('pipe() equals.', function () {
    expect(pipe.pipe).to.throw(Error)
  })
  it('pipe(add)(10) equals ', () => {
    expect(pipe.pipe(base.add)(10)).to.equal(13)
  })

  it('pipe(add, multi, minus)(10) equals ', () => {
    expect(
      pipe.pipe(
        base.add,
        base.multi,
        base.minus,
      )(10),
    ).to.equal(25)
  })

  it('pipe(multi, add, minus)(10) equals ', () => {
    expect(
      pipe.pipe(
        base.multi,
        base.add,
        base.minus,
      )(10),
    ).to.equal(22)
  })

  it('pipe(minus, add, multi)(10) equals ', () => {
    expect(
      pipe.pipe(
        base.minus,
        base.add,
        base.multi,
      )(10),
    ).to.equal(24)
  })
})


