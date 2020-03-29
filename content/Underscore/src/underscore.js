(function (root) {
  var _ = function (obj) {
    //无谬化创建实例对象
    debugger;
    if (!(this instanceof _)) {
      return new _(obj)
    }
    this.warp = obj

  }
  _.unique = function (arr, callback) {
    var result = []
    var item
    for (var i = 0; i < arr.length; i++) {
      item = callback ? callback(arr[i]) : arr[i]
      if (result.indexOf(item) === -1) {
        result.push(item)
      }
    }
    return result
  }
  /*_.prototype.unique=function () {

  }*/
  // 获取对象上的函数
  _.functions = function (obj) {
    var result = []
    for (let key in obj) {
      result.push(key)
    }
    return result
  }
  // 执行链式操作
  _.chain = function (obj) { //数据源
    var instance = _(obj)
    instance._chain = true //检测对象是否支持链式调用
    return instance
  }
  //辅助函数 将数据包装为underscore实例
  var ret = function (instance, obj) {
    if (instance._chain) {
      instance.warp = obj
      return instance
    }
    return obj
  }

  _.extend = function () {
    var target = arguments[0] || {}
    var length = arguments.length
    var i = 1
    if (typeof target !== 'object') return target
    let option
    for (; i < length; i++) {
      if ((option = arguments[i]) !== null) {
        for (let prop of option) {
          target[prop] = option[prop]
        }
      }
    }
    return target
  }
  _.clone = function (obj) {
    if (!_isObject(obj)) return obj
    return _.isArray(obj) ? obj.slice() : _.extend({}, obj)
  }
  _.map1 = function (obj) {
    obj.push('123', 'hello')
    return obj
  }
  // 关闭链式调用 返回数据本身
  _.prototype.value = function () {
    return this.warp
  }
  _.each = function (arr, callback) {
    var i = 0
    for (; i < arr.length; i++) {
      callback.call(arr, arr[i])
    }
    //console.log(arr)
  }
  // 检测静态方法 name 存放在数组中
  // 遍历数组 给_.prototype进行注册
  _.mixin = function (obj) {
    _.each(_.functions(obj), function (key) {
      var func = obj[key]
      //console.log(key)
      _.prototype[key] = function () {
        //console.log(this.warp) //数据源
        //console.log(arguments) //callback
        // 进行参数合并
        var args = [this.warp]
        Array.prototype.push.apply(args, arguments)
        return ret(this, func.apply(this, args))
      }
    })
  }
  _.mixin(_)
  root._ = _
})(this)
