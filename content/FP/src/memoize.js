// 缓存函数 memoize
// 将上次的计算结果缓存起来，当下次调用时，如果遇到相同的参数，就直接返回缓存中的数据。

let add = (a, b) => {

  return a + b
}

let memoize = function (func, content) {
  let cache = Object.create(null)
  content = content || this
  return (...key) => {
    if (!cache[key]) {
      cache[key] = func.apply(content, key)
    }
    return cache[key]
  }
}
let calc = memoize(add)
console.log(calc(10, 20))//30
console.log(calc(10, 20))//30 缓存

/**
 * Memoization
 * @param {Function} func 需要执行的函数
 * @param {Function} hasher 散列函数
 */
function memoization (func, hasher) {
  let cached = Object.create(null)
  let content = this
  return (...args) => {
    let key = '' + (hasher ? hasher.apply(content, args) : args)
    if (!cached[key]) {
      cached[key] = func.apply(content, args)
    }
    return cached[key]
  }
}

module.exports = { memoization }
