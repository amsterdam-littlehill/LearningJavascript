## 限制函数执行频率

### 背景

当我们进行窗口`resize、scroll`、input框内容校验等操作时，如果事件函数调用频率不加控制。会加重浏览器的负担，导致用户体验度差。此时我们可以在不影响功能效果的前提下使用**函数防抖和函数节流**的方式来减少调用频率。

###防抖和节流

#### 防抖

**`debounce`**，当事件触发事件时，一定时间段`t`内没有再次触发事件，事件处理函数才会执行，如果在时间段`t`内，又触发了一次函数，就重新开始延时，即再过`t`时间后执行。

在我们的开发过程中，比如resize、scroll、mousemove、mouseover等，会频发的触发，如果不做限制的话，有可能1s内执行了几十次、上百次。如果在这些函数内执行了其他函数，尤其是执行了操作DOM的函数，那不仅仅会造成计算机资源的浪费，还会降低程序运行速度，甚至会照成浏览器卡死、崩溃。

防抖的关键在于，在一个**动作发生** *一定时间之后*，才执行***特定的事件***。

```javascript
let debounce = function(fn, delay = 500) {
  if (typeof fn !== "function") {
    throw new TypeError("Expected a function");
  }
  let timer = null;
  return (...arg) => {
    if (timer) {
      clearTimeout(timer);
    }
    timer = setTimeout(function() {
      fn.call(arg);
    }, delay);
  };
};
```

过程分析：

1. 第一次触发事件，不立即执行
2. `delay`时间内，再次触发事件，清除定时器，重新开始计时
3. `delay`时间后，执行函数

![](http://pic.binyu.wang/img/20200312025155.png)


通常情况下函数在触发事件后一直等待，我们可以在第一次时间出触发后立即执行，但仍保持`delay`时间内多次触发只执行一次。`lodash.debounce`通过`leading`和`trailing`来控制函数在delay前执行，还是delay后执行。在`underscore.js`通过`immdiate`通知执行的时机。

![](http://pic.binyu.wang/img/20200312025145.png)



适用场景：

1. resize时间
2. 触发ajax请求

#### 节流

**`throttle`**，当持续触发事件时，保证一定时间段`t`内只调用一次事件处理函数。

侧重于一段时间内，执行一次。

```javascript
let throttle = function(fn, delay = 400) {
  if (typeof fn !== "function") {
    throw new TypeError("Expected a function");
  }
  let flag = true;
  return function(...args) {
    if (!flag) return;
    flag = false;
    setTimeout(() => {
      fn(...args);
      flag = true;
    }, delay);
  };
};
```

过程分析：

1. 第一次触发事件，，开关项置为false
2. `delay`时间段内，再次触发，不新计时
3. `delay`时间后执行函数，并设置开关为true
4. 再次触发事件,开关项置为false
5. 距离上次触发`delay`时间内，不执行函数
6. 距离上次触发`delay`时间后，执行函数，并设置开关true



![](http://pic.binyu.wang/img/20200312025132.png)


适用场景：

1. scroll事件
2. 重复点击事件

#### 区别

防抖：时间段内多次触发，只执行最后一次

节流：每隔固定时间段后保证稳定执行一次

一句话：防抖是将多次执行变为一次执行，节流是将多次执行变为每隔一段时间执行

### requestAnimationFrame

可以认为它是一个`_.throttle(dosomething, 16)`。但保真度更高，因为它是旨在提高准确性的浏览器本机API。

requestAnimationFrame接受一个动画执行函数作为参数，这个函数的作用是仅执行一帧动画的渲染，并根据条件判断是否结束，如果动画没有结束，则继续调用requestAnimationFrame并将自身作为参数传入

优点：

1. 以60FPS（每帧16ms）为目标，浏览器内部会选择渲染的最佳时机
2. API简单

缺点：

1. 需要手动启动和取消
2. node.js不支持

适用场景：

1. 函数是“绘画”
2. 直接对属性进行动画处理





### 参考：

https://css-tricks.com/debouncing-throttling-explained-examples/

https://juejin.im/post/5b8de829f265da43623c4261
