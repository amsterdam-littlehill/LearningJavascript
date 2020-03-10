/**
 * 需求:对数组arr中的项进行求和
 */

let arr = [1, 2, 3, 4]

// 命令式编程
let sum = arr => {
  let temp = 0
  for (let idx = 0; idx < arr.length; idx++) {
    temp += arr[idx]
  }
  return temp
}

console.log(sum(arr))

//使用reduce
let total = arr.reduce((prev, cur, idx) => {
  console.log(prev, cur, idx)
  return prev + cur
})
console.log(total)

// 扩展
// 数组去重
let existHandler = (prev, cur) => {
  if (prev && prev.indexOf(cur) === -1) {
    prev.push(cur)
  }
  return prev
}
let arr2 = [1, 3, 2, 4, 1, 3, 4, 5, 3, 2].reduce(existHandler, [])
console.log(arr2)

//
/**
 * 手动实现一个reduce
 * 核心就是遍历数组每一项参与函数运算并将返回值作为下次遍历的初始值，从而实现累加
 * 关键：1. 数组为空返回初始值。 2.无初始值时，从原数组的第二项进行遍历 3.无副作用
 * @param func 用于执行每个数组元素的函数
 * @param initVal 传递给函数的初始值
 * @param directionLeft 默认从左向右
 * @return {*[]|*}
 */
Array.prototype.reduceTest = function (func, initVal, directionLeft = true) {
  if (typeof func !== 'function') throw new TypeError(
    `${typeof func} is not a function`)
  if (!this.length) {
    if (typeof initVal !== 'undefined') {
      return initVal
    } else {
      throw new Error('Reduce of empty array with no initial value')
    }
  }
  let array = this.slice()
  let hasInitVal = typeof initVal !== 'undefined'
  let value = hasInitVal ? initVal : array[0]
  if (directionLeft === false) {
    array = array.reverse()
  }
  for (let idx = hasInitVal ? 0 : 1; idx < array.length; idx++) {
    const cur = array[idx]
    value = func.call(null, value, cur, idx, array)
  }
  return value
}
console.log([1, 3, 2, 4, 1, 3, 4, 5, 3, 2].reduceTest(existHandler, []))
