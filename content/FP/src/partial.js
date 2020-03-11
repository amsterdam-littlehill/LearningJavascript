// 偏函数demo
// 应用函数
function greet (greeting, sex, name) {
  return greeting + ' ' + sex + ' ' + name
}

/**
 * 偏函数实现
 * @param func 应用函数
 * @param argsBound 固定参数
 * @return {function(...[*]): *}
 */
let partial = (func, ...argsBound) => {
  if (typeof func !== 'function') throw new TypeError(
    `${typeof func} is not a function`)
  return function (...args) { // (*)
    if (func.length - argsBound.length > args.length) throw new Error(
      `miss arguments`)
    return func.call(this, ...argsBound.concat(...args))
  }
}

let sayHelloTo = partial(greet, 'hello')
console.log(sayHelloTo('mrs', 'lily'))
let multi = (x, y) => x * y
let partialMulti = partial(multi, 2)
console.log(partialMulti(3))//
console.log(partialMulti(3))//6
