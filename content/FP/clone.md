# 拷贝

## 复制与拷贝

```javascript
let user = {
  name: "John"
};
let user2=user; //变量名复制，只是持有了源对象的引用
let userClone=clone(user);//对象克隆，新对象是是源对象的拷贝
```

复制：将一个对象a赋值给另一个变量b，这个只是存储了对象a的引用地址，是属于同一个对象

克隆：创建一份独立的对象拷贝，新对象具有源对象项的所有可枚举属性（值），两个对象之间相互独立


## 浅拷贝

> 思路：声明一个新对象，将源对象的可枚举属性（值）拷贝到新对象上

### 实现方式

1. `for...in` 复制所有属性值

```javascript 1.8
   let dest = {}; // 新的空对象
   // 复制所有的属性值
   for (let key in src) {
     dest[key] = src[key];
   }

```
- 会拷贝对象自身以及其原型链上的可枚举属性

2. 采用jQuery使用extend,`jQuery.extent(dest,src)`以默认配置为优先，用户设置为覆盖
赋值对象的可枚举属性

- 会拷贝对象自身以及其原型链上的可枚举属性
- 无法处理值为undefined的属性/值
- 只拷贝对象中基本数据类型的属性，对于引用数据类型的数据会保持对象引用，

3. `Object.assign(dest,[ src1, src2, src3...])`,将 src1, ..., srcN 这些所有的对象复制到 dest

- 只拷贝对象中基本数据类型的属性，对于引用数据类型的数据会保持对象引用
- 如果目标对象中的属性具有相同的键，则属性将被源对象中的属性覆盖。后面的源对象的属性将类似地覆盖前面的源对象的属性。
- 只会拷贝源对象自身可枚举的属性到目标对象。该方法使用源对象的`[[Get]]`和目标对象的`[[Set]]`，所以它会调用相关 getter 和 setter。因此，它分配属性，而不仅仅是复制或定义新的属性。如果合并源包含getter，这可能使其不适合将新属性合并到原型中。为了将属性定义（包括其可枚举性）复制到原型，应使用Object.getOwnPropertyDescriptor()和Object.defineProperty() 。
- String类型和 Symbol 类型的属性都会被拷贝。
- 在出现错误的情况下，例如，如果属性不可写，会引发TypeError，如果在引发错误之前添加了任何属性，则可以更改target对象。
- 不会在那些src对象值为 null或 undefined 的时候抛出错误。
- 原始类型会被包装为对象

### 总结

无法正常处理属性(值)为引用类型的数据，

## 深拷贝

> 思路：复制的时候应该检查 `obj[key]` 的每一个值，如果它是一个对象，那么把它也复制一遍

### 实现方式

1. `jQuery.extend(true,dest,src)`,会递归处理对象的中引用数据类型属性(值)

2. `JSON.parse(JSON.stringify(obj))`

- 无法拷贝对象中`Function类型`的属性
- 无法拷贝对象中值为undefined的属性
- 无法拷贝具有循环引用的对象（可用来检测对象是否循环引用）


3. 基于递归实现

```javascript
var deepClone=function(obj) {
  // 处理数组
  if(isArray(obj)){
    return obj.map(function(ele) {
      return isArray(ele)||isObject(ele)?deepClone(ele):ele
    })
  } else if(isObject(obj)){
    return reduce(obj,function(memo,value,key) {
      memo[key]=isArray(value)||isObject(value)?deepClone(value):value
      return memo
    },{})
  }else {
    return obj
  }
}
```
以上版本并未处理循环引用问题，以及特殊的引用数据类型（Set/Map/RegExp等）


## 循环引用

 我们先来看个例子

```JAVASCRIPT
var man = {
    name: 'amsterdam',
    sex: 'male'
};
man['father'] = man;
```

对象`man`的属性`father`又指向了`man`本身,形成了“环”，如果不能正常处理此类情况，将出现调用栈溢出。

有一个标准的深拷贝算法，用于解决上面这种和一些更复杂的情况，叫做 结构化克隆算法（Structured cloning algorithm）。

算法的优点是：

- 可以复制 RegExp 对象。
- 可以复制 Blob、File 以及 FileList 对象。
- 可以复制 ImageData 对象。CanvasPixelArray 的克隆粒度将会跟原始对象相同，并且复制出来相同的像素数据。
- 可以正确的复制有循环引用的对象

依然存在的缺陷是：

- Error 以及 Function 对象是不能被结构化克隆算法复制的；如果你尝试这样子去做，这会导致抛出 DATA_CLONE_ERR 的异常。
- 企图去克隆 DOM 节点同样会抛出 DATA_CLONE_ERROR 异常。
- 对象的某些特定参数也不会被保留

  - RegExp 对象的 lastIndex 字段不会被保留
  - 属性描述符，setters 以及 getters（以及其他类似元数据的功能）同样不会被复制。例如，如果一个对象用属性描述符标记为 read-only，它将会被复制为 read-write，因为这是默认的情况下。
  - 原形链上的属性也不会被追踪以及复制。

可参考lodash等库函数的实现

## 总结

- 在实际开发过程中，我们可以预估对象的基本结构，正确的使用深浅拷贝，避免在函数中因修改对象值照成数据异常的情形。
- 大而全的东西，往往是最昂贵的。

## 参考

- [结构化克隆算法—MDN](https://developer.mozilla.org/zh-CN/docs/Web/Guide/API/DOM/The_structured_clone_algorithm)
- [Safe passing of structured data](https://html.spec.whatwg.org/multipage/structured-data.html#safe-passing-of-structured-data)

