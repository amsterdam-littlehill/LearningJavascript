let {
  deepCloneClourse,
  deepCopy,
  deepCloneByJson,
  cloneDeepByReduce_Map,
} = require('../src/deepClone.js')
let assert = require('chai').assert
let assert_node = require('assert')
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
    let actual = deepCloneClourse(objects)
    assert_node.notDeepStrictEqual(actual, objects)
    assert.ok(actual['arrays'] !== objects['arrays'])
    assert.ok(actual['array-like objects'] !== objects['array-like objects'])
    assert.ok(actual['booleans'] === objects['booleans'])
    assert.ok(actual['boolean objects'] !== objects['boolean objects'])
    assert.ok(actual['date objects'] !== objects['date objects'])
    assert.ok(actual['Foo instances'] !== objects['Foo instances'])
    assert.ok(actual['objects'] !== objects['objects'])
    assert.ok(actual['objects with object values'] !==
      objects['objects with object values'])
    assert.ok(actual['maps'] !== objects['maps'])
    assert.ok(actual['null values'] === objects['null values'])
    assert.ok(actual['numbers'] === objects['numbers'])
    assert.ok(actual['number objects'] === objects['number objects'])
    assert.ok(actual['regexes'] !== objects['regexes'])
    assert.ok(actual['sets'] !== objects['sets'])
    assert.ok(actual['strings'] === objects['strings'])
    assert.ok(actual['string objects'] === objects['string objects'])
    assert.ok(actual['undefined values'] === objects['undefined values'])

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
      assert.deepStrictEqual(actual, object)
      assert.ok(actual.bar.b === actual.foo.b && actual === actual.foo.b.c.d &&
        actual !== object)
      assert.deepStrictEqual(actual.bar.b, actual.foo.b)
      assert.deepStrictEqual(actual, actual.foo.b.c.d)
    })

})
