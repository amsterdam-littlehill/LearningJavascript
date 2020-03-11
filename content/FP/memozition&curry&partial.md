## 缓存函数

### memorizition

定义：将上次的计算结果缓存起来，当下次调用时，如果遇到相同的参数，就直接返回缓存中的数据。

```javascript
let add = (a,b) => a+b;
let calc = memoize(add);
calc(10,20);//30
calc(10,20);//30 缓存
```

如果要实现以上功能，主要依靠 **闭包 、柯里化、高阶函数** 

实现原理：把参数和对应的结果数据存在一个对象中，调用时判断参数对应的数据是否存在，存在就返回对应的结果数据，否则就返回计算结果。

理论有了，我们来实现一个缓存函数：

```javascript
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
```

过程分析：

- 在当前函数作用域定义了一个空对象，用于缓存运行结果
- 运用柯里化返回一个函数，返回的函数因为作用域链的原因，可以访问到`cache`
- 然后判断输入参数是不是在`cache`的中。如果已经存在，直接返回`cache`的内容，如果没有存在，使用函数`func`对输入参数求值，然后把结果存储在`cache`中。

在Vue中也有所体现

```javascript
/**
 * Create a cached version of a pure function.
 */
function cached (fn) {
  var cache = Object.create(null);
  return (function cachedFn (str) {
    var hit = cache[str];
    return hit || (cache[str] = fn(str))
  })
}

/**
 * Capitalize a string.
 */
var capitalize = cached(function (str) {
  return str.charAt(0).toUpperCase() + str.slice(1)
});

...

capitalize(camelizedId)
```

适用场景：

- 需要大量重复计算
- 大量计算并且依赖之前的结果

## curry与偏函数

### curry

`function currying` 把接受多个参数的函数转换成接受一个单一参数的函数

```javascript
// 非函数柯里化
var add = function (x,y) {
    return x+y;
}
add(3,4) //7

// 函数柯里化
var add2 = function (x) {
    //**返回函数**
    return function (y) {
        return x+y;
    }
}
add2(3)(4) //7
```
在上面的例子中，我们将多维参数的函数拆分，先接受第一个函数，然后返回一个新函数，用于接收后续参数。

就此，我们得出一个初步的结论：***柯里化后的函数***，如果形参个数等于实参个数，返回函数执行结果，否者，返回一个柯里化函数。

**通过柯里化可实现代码复用，使用函数式编程。**

#### 实现柯里化函数

从上面例子中，我们定义了有两个形参的函数，为了实现柯里化，函数传入第一个形参后返回一个函数用来接收第二个形参。那么如果我们的定义的形参有**三**个，那么也就需要嵌套2层，分别处理后两个参数，如

```javascript
var add3 = function (x) {
    return function (y) {
        return function (z) {
            return x + y + z;
        }
    }
}
add3(1)(3)(5)
```

如果形参有5个，7个呢？这里我们使用**递归**，进行简化。不知有没有看到规律，形参的个数决定了函数的嵌套层数。 即 **有n个参数就得嵌套n-1个函数** ，那我们来改造一番。

```javascript
// 通用型柯里化
function currying (fn) {
    // 未柯里化函数所需的参数个数  https://www.cnblogs.com/go4it/p/9678028.html
    var limit = fn.length; 
    var params = []; // 存储递归过程的所有参数，用于递归出口计算值
    return function _curry(...args) { 
        params = params.concat(args); // 收集递归参数
        if (limit <= params.length) {
            // 返回函数执行结果
            return fn.apply(null, params);
        } else {
            // 返回一个柯里化函数
            return _curry;
        }
    };
}
function add(x,y,z){
    return x + y+z;
}
// 函数柯里化
var addCurried=currying(add);
console.log(`addCurried(1)(2)(3)`,addCurried(1)(2)(3))//6
console.log(`addCurried(1,2,3)`,addCurried(1,2,3))//6
console.log(`addCurried(1,2)(3)`,addCurried(1,2)(3))
console.log(`addCurried(1)(2,3)`,addCurried(1)(2,3))
```

我们看看`addCurried(1)(2)(3)`中发生了什么:

1. 首先调用``addCurried(1)`，将`1`保存在词法环境中，然后递归调用`_curry`继续收集后续参数
2. `addCurried(1)(2)`，参数`2`与第一次的参数`1`，合并调用，因未达到形参个数要求，继续递归返回`_curry`
3. 调用`addCurried(1)(2)(3)`，参数为`3`，在接下去的调用中，与`1,2`进行合并，传入原函数`add`中

#### 注意点

1. 柯里化基于闭包实现，可能会导致内存泄露

2. 使用递归，执行会降低性能，递归多时会发生栈溢出，需要进行递归优化，[参考](https://blog.csdn.net/jhzhahuaiyu/article/details/83143591)

3. arguments是类数组，使用`Array.prototype.slice.call`转换为数组时，效率低。

###  偏函数

简单描述，就是把一个函数的某些参数先固化，也就是设置默认值，返回一个新的函数，在新函数中继续接收剩余参数，这样调用这个新函数会更简单。

```javascript
// 乘法
let multi = (x,y) => x * y;
// 构造一个对数值乘以2的函数
let double = multi.bind(null,2);
console.log(double(3));//6
console.log(double(5));//10
```

在这个例子中，我们使用`bind` 固定了 **乘数**，返回一个函数。该函数接受一个参数作为 **被乘数**。--将部分参数固定，只对剩余参数进行计算。

基于以上推导，我们来实现一个无绑定上下文的偏函数：

```javascript
/**
 * 偏函数实现
 * @param func 应用函数
 * @param argsBound 固定参数
 * @return {function(...[*]): *}
 */
let partial = (func, ...argsBound) => {
  if (typeof func !== 'function') throw new TypeError(
    `${typeof func} is not a function`)
  return function (...args) { // (*)
    if(func.length-argsBound.length>args.length) throw new Error(`miss arguments`)
    return func.call(this, ...argsBound.concat(...args))
  }
}
let partialMulti= partial(multi,2)
console.log(partialMulti());//Error: miss arguments
console.log(partialMulti(3));//6
```

`partial(func[, arg1, arg2...])` 调用的结果是一个基于 `func` 的封装函数，以及：

- 和它传入的函数一致的 `this` 
- 然后传入 `...argsBound` —— 来自偏函数调用传入的参数
- 然后传入 `...args` —— 传入封装函数的参数

#### 区别

偏函数与柯里化很相似，下面我们做个对比：

柯里化：将一个对参数函数转换成多个单参数的函数，也就是将一个n元函数转换为n个一元函数。

偏函数：固定一个函数的一个或多个参数，也就是将一个n元函数转换成一个n-x元函数。

个人理解：**偏函数是柯里化的一种特定的应用场景**

### 使用场景

- 动态生成函数
- 减少参数
- 延迟计算
