/**
 * 1.对象
 * 2.函数
 * 3.正则
 * 4.数组
 * 5.基本数据类型
 * 6.Symbol
 * 7.Date
 * @param source
 * @return {{}}
 */
const deepCopy = source => {
  //目标对象
  let target = Object.freeze(source)

  function split (obj, propName) {
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

// 简化递归
const deepCloneClourse = (obj) => {
  //检测循环引用
  try {
    JSON.stringify(obj)
  } catch (e) {
    throw e
  }
  let cloneObj
  let objectType = getType(obj)
  switch (objectType) {
    // Object
    case 'Object':
      cloneObj = getType(obj, 'Array') ? [] : {}
      for (let item in obj) {
        if (obj.hasOwnProperty(item)) {
          cloneObj[item] = deepCloneClourse(obj[item])
        }
      }
      //key-value 类型中Key可能是symbol
      Object.getOwnPropertySymbols(obj).forEach(item => {
        let symbol = Object(Symbol.prototype.valueOf.call(item))
        cloneObj[symbol] = deepCloneClourse(obj[item])
      })
      break
    // 容器类
    case 'Set':
      cloneObj = new Set()
      obj.forEach((val) => {
        cloneObj.add(deepCloneClourse(val))
      })
      break
    case 'Map':
      cloneObj = new Map()
      obj.forEach((val, key) => {
        cloneObj.set(key, deepCloneClourse(val))
      })
      //key-value 类型中Key可能是symbol
      Object.getOwnPropertySymbols(obj).forEach(item => {
        let symbol = Object(Symbol.prototype.valueOf.call(item))
        cloneObj[symbol] = deepCloneClourse(obj[item])
      })
      break
    case 'Array':
      cloneObj = []
      obj.forEach((val) => {
        cloneObj.push(deepCloneClourse(val))
      })
      break
    // 普通对象
    case 'RegExp':
    case 'Date':
      cloneObj = new obj.constructor(obj)
      break
    case 'Symbol':
      cloneObj = Object(Symbol.prototype.valueOf.call(obj))
      break
    default://null undefined NaN string number boolean
      cloneObj = obj
  }
  return cloneObj
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

function Foo () {
  this.a = 1
}

Foo.prototype.b = 1
Foo.c = function () {}
let map = new Map
map.set('a', 1)
map.set('b', 2)
let set = new Set
set.add(1)
set.add(2)
let symb = Symbol(111)
const x = {
  [symb]: '222',
  'arrays': ['a', ''],
  'array-like objects': { '0': 'a', 'length': 1 },
  'booleans': false,
  'boolean objects': Object(false),
  'date objects': new Date,
  'Foo instances': new Foo,
  'objects': { 'a': 0, 'b': 1, 'c': 2 },
  'objects with object values': { 'a': /a/, 'b': ['B'], 'c': { 'C': 1 } },
  'maps': map,
  'null values': null,
  'numbers': 0,
  'number objects': Object(0),
  'regexes': /a/gim,
  'sets': set,
  'strings': 'a',
  'string objects': Object('a'),
  'undefined values': undefined,
}
//检测循环引用
//x.a=x
let result = deepCloneClourse(x)
for (let item of Reflect.ownKeys(x)) {
  console.log(
    `${x[item] + ''}--------${result[item] + ''} ===>${x[item] ===
    result[item]}`)
}

