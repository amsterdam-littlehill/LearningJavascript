/**
 * 需求:三维数组转一维数组
 */
let arr = [
  1, 2, 3, [4, 5], [[6]],
]

// 递归
let coverArr = (arr) => {
  let temp = []

  function cover (arr) {
    for (let i = 0; i < arr.length; i++) {
      if (Array.isArray(arr[i])) {
        cover(arr[i])
      } else {
        temp.push(arr[i])
      }
    }
  }

  cover(arr)
  return temp
}
console.log(coverArr(arr))

// 使用flat
//console.log(arr.flat(3))

/**
 * 数组扁平化
 * @param depth 拉平深度 默认为1,最大为Infinity
 */
Array.prototype.flatTest = function (depth = 1) {
  let arr = this.slice()
  const result = []
  let flattenDepth = 1;
  (function flatten (list) {
    list.forEach((item) => {
      if (flattenDepth < depth && Array.isArray(item)) {
        flattenDepth++
        flatten(item)
      } else {
        result.push(item)
      }
    })
  })(arr)
  return result
}
console.log(arr.flatTest())
