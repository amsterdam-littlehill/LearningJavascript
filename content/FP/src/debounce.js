/**
 * 函数防抖
 * @param fn 目标函数
 * @param delay 延时
 */
let debounce = (fn, delay = 100) => {
  let timer = null
  return (...args) => {
    if (timer) {
      clearTimeout(timer)
    }
    timer = setTimeout(() => {
      fn(...args)
    }, delay)
  }
}
