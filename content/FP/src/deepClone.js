/**
 * 自身可枚举、自身不可枚举、自身 Symbol 类型键、原型上可枚举、原型上不可枚举、原型上的 Symbol 类型键，循环引用
 * @param source
 * @return {{}}
 */
const deepCopy = source => {
  //目标对象
  let target = Object.freeze(source)

  function split (obj) {
    let temp = null
    if (isObject(obj)) {
      temp = {}
      let keys = Object.keys(obj)
      keys.forEach(key => {
        if (isObject(obj[key]) || isArray(obj[key])) {
          temp[key] = split(obj[key], key)
        } else if (isPrimitive(obj[key])) {
          temp[key] = obj[key]
        }
      })
    } else if (isArray(obj)) {
      temp = []
      obj.forEach((item, index) => {
        if (isObject(item) || isArray(item)) {
          temp[index] = split(item)
        } else if (isPrimitive(item)) {
          temp[index] = item
        }
      })
    } else {
      temp = obj
    }
    return temp
  }

  return split(target)

}
const deepCloneByJson = (obj) => {
  // 声明cache变量，便于匹配是否有循环引用的情况
  let cache = []
  let str = JSON.stringify(obj, (key, value) => {
    if (typeof value === 'object' && value !== null) {
      if (cache.indexOf(value) !== -1) {
        // 移除
        return
      }
      // 收集所有的值
      cache.push(value)
    }
    return value
  })
  cache = null
  return JSON.parse(str)
}
const cache = (caches, obj) => {
  let cached = caches.get(obj)
  if (cached) {
    return cached
  }
  return null
}
// 简化递归
const deepCloneClourse = (target) => {
  let cached = new WeakMap()

  function baseClone (obj) {
    let objectType = getType(obj)
    let cloneObj
    // 检测对象是否已克隆 返回克隆后的对象
    let temp = cache(cached, obj)
    if (temp) {
      return temp
    }
    switch (objectType) {
      // Object
      case 'Object':
        //缓存已克隆对象
        cached.set(obj, cloneObj = {})
        //key-value 类型中Key可能是symbol
        Object.getOwnPropertySymbols(obj).forEach(item => {
          let symbol = Object(Symbol.prototype.valueOf.call(item))
          cloneObj[symbol] = baseClone(obj[item])
        })
        break
      // 容器类
      case 'Set':
        //缓存已克隆对象
        cached.set(obj, cloneObj = new Set())
        obj.forEach((val) => {
          cloneObj.add(baseClone(val, cached))
        })
        break
      case 'Map':
        //缓存已克隆对象
        cached.set(obj, cloneObj = new Map())
        obj.forEach((val, key) => {
          cloneObj.set(key, baseClone(val))
        })
        //key-value 类型中Key可能是symbol
        Object.getOwnPropertySymbols(obj).forEach(item => {
          let symbol = Object(Symbol.prototype.valueOf.call(item))
          cloneObj[symbol] = baseClone(obj[item])
        })
        break
      case 'Array':
        //缓存已克隆对象
        cached.set(obj, cloneObj = [])
        obj.forEach((val) => {
          cloneObj.push(baseClone(val))
        })
        break
      // 普通对象
      case 'RegExp':
        cloneObj = new RegExp(obj.source, obj.flags)
        break
      case 'Date':
        cloneObj = new Date(obj)
        break
      case 'Symbol':
        cloneObj = Object(Symbol.prototype.valueOf.call(obj))
        break
      case 'Boolean':
        cloneObj = Boolean(obj)
        break
      case 'Function':
        cloneObj = function () {
          return obj.apply(this, arguments)
        }
        break
      default://null undefined NaN string number boolean
        cloneObj = obj
    }
    if (typeof obj === 'object') {
      for (let item in obj) {
        if (obj.hasOwnProperty(item)) {
          cloneObj[item] = baseClone(obj[item])
        }
      }
    }
    return cloneObj
  }

  return baseClone(target)
}
/**
 * 基于map_reduce进行深复制
 * @param obj
 * @return {*}
 */
let cloneDeepByReduce_Map = function (obj) {
  if (isArray(obj)) {
    // 数组枚举
    return obj.map(ele => {
      return isArray(ele) || isObject(ele) ? cloneDeepByReduce_Map(ele) : ele
    })
  } else if (isObject(obj)) { // 迭代处理对象属性
    return obj.reduceObj((memo, value, key) => {
      memo[key] = isArray(value) || isObject(value)
        ? cloneDeepByReduce_Map(value)
        : value
      return memo
    }, {})
  } else {
    return obj
  }
}
/**
 * 判断是否是类数组
 * @param collect
 */
let isArrayLike = function (collect) {
  return typeof collect === 'object' && collect['length'] && collect.length >
    0 && collect.length < Math.pow(2, 53) - 1
}

/**
 * underscore createReduce
 * @param direction
 * @return {function(*=, *=, *=, *): *}
 */
function reduceFactory (direction = 1) {
  let reducer = function (obj, iteratee, memo, initial) {
    let keys = !isArrayLike(obj) && Object.keys(obj)
    let length = (keys || obj).length
    let index = direction > 0 ? 0 : length - 1
    if (!initial) {
      // 初始化数组第一个值或者对象的第一个属性
      memo = obj[keys ? keys[index] : index]
      index += direction
    }
    for (; index >= 0 && index < length; index += direction) {
      let currentKey = keys ? keys[index] : index
      memo = iteratee(memo, obj[currentKey], currentKey, obj)
    }
    return memo
  }
  return function (iteratee, memo, context) {
    let initial = arguments.length >= 2
    return reducer(this, iteratee, memo, initial)
  }
}

/**
 * 获取对象类型
 */
let getType = (obj, type) => {
  let types = {
    '[object Function]': 'Function',
    '[object Set]': 'Set',
    '[object Map]': 'Map',
    '[object Date]': 'Date',
    '[object Object]': 'Object',
    '[object RegExp]': 'RegExp',
    '[object Array]': 'Array',
    '[object Error]': 'Error',
    '[object Number]': 'Number',
    '[object String]': 'String',
    '[object Boolean]': 'Boolean',
    '[object Symbol]': 'Symbol',
  }
  let objectType = Object.prototype.toString.call(obj)
  return !type ? types[objectType] : types[objectType] === type
}
const isFunc = (obj) => {
  return Object.prototype.toString.call(obj) === '[object Function]'
}
const isSet = (obj) => {
  return Object.prototype.toString.call(obj) === '[object Set]'
}
const isMap = (obj) => {
  return Object.prototype.toString.call(obj) === '[object Map]'
}
const isDate = (obj) => {
  return Object.prototype.toString.call(obj) === '[object Date]'
}
const isObject = (obj) => {
  return Object.prototype.toString.call(obj) === '[object Object]'
}
const isRegExp = (obj) => {
  return Object.prototype.toString.call(obj) === '[object RegExp]'
}
const isArray = (obj) => {
  return Object.prototype.toString.call(obj) === '[object Array]'
}

const isPrimitive = (val) => {
  return typeof val === 'string' || typeof val === 'number' || typeof val ===
    'boolean' || typeof val === 'symbol'
}

module.exports = {
  deepCloneClourse,
  deepCopy,
  deepCloneByJson,
  cloneDeepByReduce_Map,
}
