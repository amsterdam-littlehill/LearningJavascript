let base = require('./base.js')
// 命令式编程
let calculate = x => (x + 10) * 10
// 1.有共同的参数 x
// 2.函数的执行顺序是 从右到左
// 使用递归
let compose = (...fns) => {
  if (fns.length === 0) throw new Error(
    'compose requires at least one argument')
  if (!base.isFunc(fns)) throw new TypeError(
    'componse requires argument is Function')
  return (...args) => {
    return fns.reduceRight((res, fn) => {
      return fn(res)
    }, ...args)
  }
}
console.log('compose1:' + compose(base.multi, base.add)(10, 2))
// 使用循环循环
let compose2 = (...fns) => {
  if (fns.length === 0) throw new Error(
    'compose requires at least one argument')
  if (!base.isFunc(fns)) throw new TypeError(
    'componse requires argument is Function')
  return (...args) => {
    //不可变性
    const list = fns.slice()
    if (list.length > 0) {
      const fn = list.pop()
      let result = fn(...args)
      while (list.length > 0) {
        result = list.pop()(result)
      }
      return result
    }
  }
}
console.log('compose2:'+compose2(base.multi,base.add)(10))
