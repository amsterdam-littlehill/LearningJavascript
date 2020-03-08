## 函数式编程-组合函数

用于转换函数或数据，增强函数或数据行为的高阶函数。

特点：

1. 本身就是高阶函数
2. 不改变原函数的最终意图，即原函数与新函数所需参数、返回值一样。
3. 能增强原函数的行为。

### compose

- 将需要嵌套执行的函数平铺
- 嵌套执行指的时，一个函数的返回值将作为另一个函数的参数

作用：实现函数式编程中的Pointfree，使我们专注于转换而不是数据

也就是说将数据的处理过程定义成一种与参数无关的合成运算。

而Pointfree不使用所要处理的值，而这就是无参数分割

```javascript
// 命令式编程
let calculate =x=>(x+10)*10;
// 拆解函数
let add =x=>x+10
let multi=x=>x*10
console.log(multi(add(10)))
// 1.有共同的参数 x
// 2.函数的执行顺序是 从右到左 
let compose = (...args)=>{
  return x=>{
    return args.reduceRight((res,next)=>{
      return next(res) 
    },x)  
  }
}
console.log(compose(multi,add)(10))
```

在这个函数中我们先定义了两个纯函数`add`和`multi`，通过`compose`将其进行组合调用，其内部逻辑时，先调用`add`，并将返回值作为`multi`的参数。

### Pipe

也是一种函数组合方式，与`compose`的唯一区别在于，`pipe`的调用顺序是**从左到右**

接着上面的例子

```javascript
let pipe=(...args)=>{
  return x=>{
    return args.reduce((res,next)=>{
	  return next(res)
    },x)
  }
}
console.log(pipe(add,multi)(10))
```

