let throttle = function (fn, delay = 2000) {
  if (typeof fn !== 'function') {
    throw new TypeError('Expected a function')
  }
  let flag = true
  console.log(this)
  return function (...args) {
    if (!flag) return
    flag = false
    setTimeout(() => {
      fn(...args)
      flag = true
    }, delay)
  }
}
