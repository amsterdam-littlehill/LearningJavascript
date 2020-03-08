module.exports.add = (x) => x + 10
module.exports.multi = (x) => x * 10
module.exports.isFunc = (args) => {
  let flag = true
  for (let i = 0; i < args.length; i++) {
    if (typeof args[i] !== 'function') {
      flag = false
    }
  }
  return flag
}
