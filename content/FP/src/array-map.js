// 命令式编程
const arr = [1, 2, 3]
let fn = (arr) => {
  let temp = []
  for (let i = 0; i < arr.length; i++) {
    temp.push(arr[i] * 2)
  }
  return temp
}
console.log(fn(arr))

// 使用map
// function(currentValue, index,arr)
const temp = arr.map(item => item * 2)
console.log(temp)

/**
 * 手动实现map
 * 原理：遍历函数的每一项作为函数的入参，并返回每次函数调用结果组成的数组
 * 关键：1.func 必须是函数类型 2.无副作用
 * @param func 执行每个数组元素的函数
 * @param content 对象作为该执行回调时使用，传递给函数，用作 "this" 的值。
 */
Array.prototype.mapTest = function (func, content) {
  if (typeof func !== 'function') throw new TypeError(
    `${typeof func} is not a function`)
  let arrTemp = this.slice()
  content = typeof content === 'undefined' ? null : content
  let result = []
  for (let idx = 0; idx < arrTemp.length; idx++) {
    result.push(func.call(content, arrTemp[idx], idx, arrTemp))
  }
  return result
}
console.log(arr.mapTest(item => item * 2))
