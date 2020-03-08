let base = require('./base.js')
// 函数的执行顺序是 从左到右
// 使用递归
let pipe = (...fns) => {
  if (fns.length === 0) throw new Error(
    'pipe requires at least one argument')
  if (!base.isFunc(fns)) throw new TypeError(
    'pipe requires argument is Function')
  return (...args) => {
    return fns.reduce((res, fn) => {
      return fn(res)
    }, ...args)
  }
}
console.log('pipe1:' + pipe(base.add,base.multi)(10, 2))
// 使用循环循环
let pipe2 = (...fns) => {
  if (fns.length === 0) throw new Error(
    'pipe requires at least one argument')
  if (!base.isFunc(fns)) throw new TypeError(
    'pipe requires argument is Function')
  return (...args) => {
    //不可变性
    const list = fns.slice()
    if (list.length > 0) {
      const fn = list.shift()
      let result = fn(...args)
      while (list.length > 0) {
        result = list.shift()(result)
      }
      return result
    }
  }
}
console.log('pipe2:' + pipe2(base.add, base.multi)(10))
module.exports = { pipe, pipe2 }
