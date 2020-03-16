let deepCloneClourse = require('../src/deepClone.js')
let assert = require('chai').assert
describe('deepClone.js.js: ', function () {
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
  const objects = {
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
  it('`deepCloneClourse` should perform a deep clone', function () {
    let array = [{ 'a': 0 }, { 'b': 1 }],
      actual = deepCloneClourse(array)

    assert.deepStrictEqual(actual, array)
    assert.ok(actual !== array && actual[0] !== array[0])
  })

  it('`deepCloneClourse` should deep clone objects with circular references',
    function () {
      let object = {
        'foo': { 'b': { 'c': { 'd': {} } } },
        'bar': {},
      }

      object.foo.b.c.d = object
      object.bar.b = object.foo.b

      let actual = deepCloneClourse(object)
      assert.ok(actual.bar.b === actual.foo.b && actual === actual.foo.b.c.d &&
        actual !== object)
    })

})
