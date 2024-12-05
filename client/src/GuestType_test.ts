import * as assert from 'assert';
import { Guest, toJson, fromJson } from './GuestType';

describe('Guest', function() {
    it('toJson', function() {
        // 2 tests per subdomain, straight-line code
        const g1: Guest = {name: 'bobo', info: {
            host: "James", isFamily: true, plusone: 0
        }}
        assert.deepStrictEqual(toJson(g1), [
            'bobo', 
            [
                'James', true, 0, undefined, 
                [undefined, undefined]
            ]
        ])

        const g2: Guest = {name: 'josep', info: {
            host: "Molly", isFamily: false, plusone: 1, plusonename: 'jana',
            restrictions: {guest: 'none', addguest: 'caca'}
        }}
        assert.deepStrictEqual(toJson(g2), [
            'josep',
            [
                'Molly', false, 1, 'jana',
                ['none', 'caca']
            ]
        ])
    })

    it('fromJson', function() {
        //2 tests per subdomain, straight-line code
        const g1: unknown = ['lopez', ['James', true, 0, undefined, ['none', undefined]]];
        assert.deepStrictEqual(fromJson(g1), {
            name: 'lopez', info: {
                host: 'James', isFamily: true, plusone: 0, plusonename: undefined,
                restrictions: {guest: 'none', addguest: undefined}
            }
        })

        const g2: unknown = ['maria', ['Molly', false, 1, 'beta', ['none', 'many']]];
        assert.deepStrictEqual(fromJson(g2), {
            name: 'maria', info: {
                host: 'Molly', isFamily: false, plusone: 1, plusonename: 'beta',
                restrictions: {guest: 'none', addguest: 'many'}
            }
        })
    })
})