/**
 * 需求:过滤出对象数组中age大于10的元素
 */

let persons = [
  { 'name': 'Bob', age: 12 },
  { 'name': 'Lily', age: 13 },
  { 'name': 'Tom', age: 9 },
  { 'name': 'Jone', age: 99 },
]

// 命令式编程
let result = () => {
  let res = []
  for (let idx = 0; idx < persons.length; idx++) {
    if (persons[idx].age > 10) {
      res.push(persons[idx])
    }
  }
  return res
}
console.log(result())

// 使用filter
let filterResult = persons.filter(item => item.age > 9)
console.log(filterResult)

/**
 * 手动实现filter
 * 原理：创建一个新的数组，新数组中的元素是原数组中符合条件的项
 * 关键：1.函数返回值为Boolean 2.无副作用
 * @param func 执行每个数组元素的函数
 * @param content 对象作为该执行回调时使用，传递给函数，用作 "this" 的值。
 */
Array.prototype.filterTest = function (func, content) {
  if (typeof func !== 'function') throw new TypeError(
    `${typeof func} is not a function`)
  if (!this.length) return []
  let arr = this.slice()
  content = typeof content === 'undefined' ? null : content
  let result = []
  for (let idx = 0; idx < arr.length; idx++) {
    let res = func.call(content, arr[idx], idx, arr)
    if (res) {
      result.push(arr[idx])
    }
  }
  return result
}
console.log(persons.filterTest(item => item.age > 9))
