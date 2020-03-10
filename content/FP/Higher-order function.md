## 高阶函数

### 概念

Javascript中的函数本质上都指向某个变量，既然变量可以指向函数，函数的参数可以接受变量，那么函数是不是可以可以作为另一个函数的入参？因为Javascript是一门弱类型语言，不会对函数输入值和函数的输出值进行强定义和类型检查。所以函数**可以作为参数**，也**可以作为输出值**。

一个最简单的高阶函数：

```javascript
let add=(x,y,f)=>f(x)+f(y);
```

对其他函数进行操作的函数，可以将他们作为参数或返回它们。

### 高阶函数分类

- 函数作为参数传递
- 函数作为返回值

### map/reduce/filter

#### map

定义：map() 方法返回一个新数组，不会改变原始数组。同时新数组中的元素为原始数组元素调用函数处理后的值，并按照原始数组元素顺序依次处理元素。

语法：`array.map(function(currentValue /*必填，当前元素的值 */,index /*可选，当前元素的索引*/,arr /*可选，当前元素属于的数组对象*/), thisValue /*可选，上下文对象，用作this，默认为全局对象*/)`

有以下需求：创建一个新数组，其中的值是原数组的值的两倍。

```javascript
const arr=[1,2,3]
let fn=(arr)=>{
  let temp=[]
  for(let i=0;i<arr.length;i++){
    temp.push(arr[i]*2)
  }
  return temp;
}
console.log(fn(arr))
```

以上是我们的命令式编程，我们改写下：

```javascript
const temp=[1,2,3].map(item=>item*2)
console.log(temp)
```

在这里我们使用`(item)=>item*2`作为**map**函数的参数。

手动实现`map()`，遍历函数的每一项作为函数的入参，并返回每次函数调用结果组成的数组

> 关键：1.函数为空，返回空  2.func 必须是函数类型，需要有return值，否则会出现所有项映射为undefind  3.无副作用

```javascript
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
```



#### reduce

定义：reduce() 方法接收一个函数作为累加器，数组中的每个值（从左到右）开始缩减，最终计算为一个值

语法：`array.reduce(function(total /*必需。初始值, 或者计算结束后的返回值*/, currentValue/*必需。当前元素*/, currentIndex/*可选。当前元素的索引*/, arr/*可选。当前元素所属的数组对象。*/), initialValue/*可选。传递给函数的初始值*/)`

有以下需求：对数组arr的项进行求和

```javascript
let arr=[1,2,3,4]

// 命令式编程
let sum=arr=>{
  let temp=0;
  for(let idx=0;idx<arr.length;idx++){
    temp+=arr[idx]
  }
  return temp
}
//使用reduce
let total=arr.reduce((prev,cur)=>{
  return prev+cur
},0)
```

过程分析：

第一次执行时，`prev`的值为我们的初始值0，返回`0+cur`(当前数组的第一位)作为第二次执行时的`prev`….从而达到累加的目的；

手动实现一个`reduce()`，核心就是**遍历数组每一项参与函数运算并将返回值作为下次遍历的初始值**，从而实现累加。

> 关键点**：1.无初始值时，从原数组的第二项进行遍历** **2.无副作用**

```javascript
Array.prototype.reduceTest = function(func, initVal, directionLeft = true) {
  if (typeof func !== 'function') throw new TypeError(`${typeof func} is not a function`)
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
    value = func.call(null,value, cur, idx, array)
  }
  return value
}
```

#### filter

定义：filter() 方法创建一个新的数组，新数组中的元素是通过检查指定数组中符合条件的所有元素。

语法：`array.filter(function(currentValue/*必须。当前元素的值*/,index/*可选。当前元素的索引值*/,arr/*可选。当前元素属于的数组对象*/), thisValue/*可选。对象作为该执行回调时使用，传递给函数，用作 "this" 的值*/)`

需求:过滤出对象数组中age大于10的元素

```javascript
let persons = [
  { 'name': 'Bob', age: 12 },
  { 'name': 'Lily', age: 13 },
  { 'name': 'Tom', age: 9 },
  { 'name': 'Jone', age: 99 },
]

// 命令式编程
let result=()=>{
  let res=[];
  for(let idx=0;idx<persons.length;idx++){
    if(persons[idx].age>10){
      res.push(persons[idx])
    }
  }
  return res;
}
// 使用filter
let filterResult=persons.filter(item=>item.age>9);
```

手动实现一个`filter()`，核心就是**创建一个新的数组，新数组中的元素是原数组中符合条件的项**。

> 关键点**：1.函数返回值为true/false 2.无副作用**

```javascript
Array.prototype.filterTest=function (func,content) {
  if (typeof func !== 'function') throw new TypeError(`${typeof func} is not a function`)
  if (!this.length) return []
  content = typeof content === 'undefined' ? null : content
  let result=[]
  for(let idx=0;idx<arr.length;idx++){
    let res=func.call(content,arr[idx],idx,arr)
    if(res){
      result.push(arr[idx])
    }
  }
  return result
}
```

### flat

注意：**普通浏览器（仅Chrome v69，Firefox Nightly和Opera 56等）/Node.js （需V11.0.0及以上） 尚未实现`flat`方法。这是一项实验性功能。** [[MDN 说明以及替代方案](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Array/flat)] 

用法：将目标嵌套数组扁平化，变为新的一维数组

语法：`arrry.flat([depth]/*指定要提取嵌套数组的结构深度，默认值为 1。Infinity为无限*/)`

手动实现一个`flat()`

```javascript
/**
 * 数组扁平化
 * @param depth 拉平深度 默认为1,最大为Infinity
 */
Array.prototype.flatTest = function (depth = 1) {
  let arr = this.slice()
  const result = []
  // 当前已拉平层数 
  let flattenDepth = 1;
  // 先拉平第一层
  (function flatten (list) {
    list.forEach((item) => { 
      if (flattenDepth < depth &&Array.isArray(item)) {
        flattenDepth++
        flatten(item)
      } else {
        result.push(item)
      }
    })
  })(arr)
  return result
}
```



### 总结

高阶函数本质上就是对算法的高度抽象，通过提高抽象度，实现最大程度**代码重构**。

