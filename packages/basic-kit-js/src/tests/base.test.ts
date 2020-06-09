import { xEmpty, xObject } from "../index";

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
})
