// 通用型柯里化
// 用于将函数柯里化
function currying (fn) {
  // 未柯里化函数所需的参数个数  https://www.cnblogs.com/go4it/p/9678028.html
  var limit = fn.length
  var params = [] // 存储递归过程的所有参数，用于递归出口计算值
  return function _curry (...args) {
    params = params.concat(...args) // 收集递归参数
    if (limit <= params.length) {
      let tempParams = params.slice(0, limit)
      if (limit === params.length) { //参数个数满足时清除已缓存的参数
        params = []
      }
      // 返回函数执行结果
      return fn.apply(null, tempParams)
    } else {
      // 返回一个柯里化函数
      return _curry
    }
  }
}

function add (x, y, z) {
  return x + y + z
}

var addCurried = currying(add)
console.log(`addCurried(1)(2)(3)`, addCurried(1)(2)(3))//6
console.log(`addCurried(3,3,3)`, addCurried(3, 3, 3))//9
console.log(`addCurried(1,2)(3)`, addCurried(1, 2)(3))//6
console.log(`addCurried(3)(4,5)`, addCurried(3)(4, 5))//12
/**
 * 高级柯里化
 * @param func
 * @return {curried}
 */
function curry (func) {
  let limit = func.length
  return function curried (...args) {
    //立刻执行
    if (args.length >= limit) {
      return func.apply(this, args)
    } else {
      //返回一个偏函数
      return function (...args2) {
        return curried.apply(this, args.concat(args2))
      }
    }
  }

}

// 函数柯里化
/*curriedAdd = curry(add)
let curriedAdd2=curriedAdd(1)
console.log(curriedAdd2(2,4))*/
