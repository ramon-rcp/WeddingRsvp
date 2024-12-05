import * as assert from 'assert';
import { makeMap, MutableMap } from './map';

// TODO: write test cases for the methods of your map class
describe("map", function() {
    const map: MutableMap<number> = makeMap()
    map.set('boo', 1)

    it('contains', function() {
        //2 tests per subdomain, function call
        assert.deepStrictEqual(map.contains('boo'), true)
        assert.deepStrictEqual(map.contains('als'), false)
    })

    it('get', function(){
        map.set('op', 2)
        //2 tests per subdomain, function call
        assert.deepStrictEqual(map.get('boo'), 1)
        assert.deepStrictEqual(map.get('op'), 2)
    })

    it('set', function(){
        //2 tests for return statement, replacement branch
        //2 tests for obj state, replacement branch
        assert.deepStrictEqual(map.set('boo', 3), true)
        assert.deepStrictEqual(map.get('boo'), 3)
        assert.deepStrictEqual(map.set('op', 4), true)
        assert.deepStrictEqual(map.get('op'), 4)

        //2 tests for return statement, addition branch
        //2 tests for obj state, addition branch
        assert.deepStrictEqual(map.set('caca', 3), false)
        assert.deepStrictEqual(map.get('caca'), 3)
        assert.deepStrictEqual(map.set('bobo', 3), false)
        assert.deepStrictEqual(map.get('bobo'), 3)
    })

    it('clear', function(){
        //2 tests for obj state
        map.clear()
        assert.deepStrictEqual(map.contains('boo'), false)
        map.set('aiks', 1)
        map.clear()
        assert.deepStrictEqual(map.contains('aiks'), false)
    })

    it('getKeys', function(){
        map.set('caca', 1)
        map.set('bobo', 2)

        //2 tests per subdomain, straight line code
        assert.deepStrictEqual(map.getKeys(), ['caca', 'bobo'])
        map.set('messi', 3)
        assert.deepStrictEqual(map.getKeys(), ['caca', 'bobo', 'messi'])
    })

    it('getAllValues', function() {
        map.clear()
        map.set('caca', 1)
        map.set('bobo', 2)

        //2 tests per subdomain, straight line code
        assert.deepStrictEqual(map.getAllValues(), [1, 2])
        map.set('messi', 3)
        assert.deepStrictEqual(map.getAllValues(), [1, 2, 3])
    })
})
