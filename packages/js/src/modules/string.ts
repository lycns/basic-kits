
type ISampleParser = {
    [key: string]: (value: string) => [boolean, any]
}
const sampleParser: ISampleParser = {
    number: (value: string) => [!!value && !isNaN(Number(value)), Number(value)],
    boolean: (value: string) => [['true', 'false'].includes(value), value === 'true' ? true : false],
    string: (value: string) => [true, value],
}


export function xParse(value: string | string[], type?: string) {
    if (Array.isArray(value)) {
        if (!type) {
            return value.map(tryParse)
        }
        const parser = sampleParser[type]
        return value.map(v => {
            const [pass, res] = parser(v)
            return pass ? res : null
        })
    }
    if (!type) {
        return tryParse(value)
    }

    const parser = sampleParser[type]
    const [pass, res] = parser(value)
    return pass ? res : null
}

function tryParse(arg: string) {
    try {
        return JSON.parse(arg)
    } catch(e) {
        return arg
    }
}