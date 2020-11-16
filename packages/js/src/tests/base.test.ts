import { xEmpty, xObject, xArray, xDate, xBlocking, xSleep, xType } from "../index";
import { xIsType } from '../modules/base';

test('test for xEmpty', () => {
    const empties = [ null, undefined, NaN, '', {}, []]
    const noempties = [true, false, [1], { a: 1 }, 0, -1, '1']

    empties.forEach(x => {
        expect(xEmpty(x)).toBe(true)
    })
    noempties.forEach(x => {
        expect(xEmpty(x)).toBe(false)
    })
})

test('test for xEmpty unstrict', () => {
    const empties = [ null, undefined, NaN, '']
    const noempties = [true, false, [1], { a: 1 }, 0, -1, '1', {}, []]

    empties.forEach(x => {
        expect(xEmpty(x, { strict: false })).toBe(true)
    })
    noempties.forEach(x => {
        expect(xEmpty(x, { strict: false })).toBe(false)
    })
})

test('test for xEmpty extras', () => {
    const empties = [ null, undefined, NaN, '', {}, [], -1, 0]
    const noempties = [true, false, [1], { a: 1 }, 1, '1']

    empties.forEach(x => {
        expect(xEmpty(x, { extras: [-1, 0] })).toBe(true)
    })
    noempties.forEach(x => {
        expect(xEmpty(x, { extras: [-1, 0] })).toBe(false)
    })
})

test('test for xObject', () => {
    const input = {
        a: null,
        b: {},
        c: '',
        d: 1,
        e: -1,
    }
    expect(xObject(input)).toMatchObject({ d: 1, e: -1 })
    expect(xObject(input, { strict: false })).toMatchObject({ b: {}, d: 1, e: -1 })
    expect(xObject(input, { extras: [-1] })).toMatchObject({ d: 1 })
    expect(xObject(null)).toMatchObject({})
})

test('test for xArray', () => {
    const input = [
        -1, 0, 1, null, {}, '', true
    ]
    expect(xArray(input)).toMatchObject([ -1, 0, 1, true])
    expect(xArray(null)).toMatchObject([])
})

test('test for xType', () => {
    expect(xType(/test/)).toEqual('regexp')
    expect(xType([])).toEqual('array')
    expect(xType(() => {})).toEqual('function')
    expect(xType({})).toEqual('object')
    expect(xIsType({}, 'object')).toEqual(true)
})

test('test for xDate', () => {
    const now = new Date()
    expect(xDate('2020-1-1')).toMatchObject(new Date('2020/1/1'))
    expect(xDate(now)).toMatchObject(now)
})

test('test for xBlocking', (done) => {
    expect(xBlocking(10)).toEqual(10)
    done()
})

test('test for xSleep', async (done) => {
    expect(await xSleep(10)).toEqual(undefined)
    done()
})
