import { xType } from "./type"

const EMPTIES = [null, undefined, NaN, '']

export type IEmptyOpts = {
    extras?: any[],
    strict?: boolean,
    exclude?: any[],
}

export function xEmpty(value: any, opts: IEmptyOpts = {} ) {
    const { extras = [], strict = true, exclude = [] } = opts
    const filters = [ ...extras, ...EMPTIES ].filter(x => !exclude.includes(x))
    const type = xType(value)
    if (strict && ['object'].includes(type)) {
      return Object.keys(value).length === 0
    } else if (strict && ['array'].includes(type)) {
      return value.length === 0
    } else {
      return filters.includes(value)
    }
}

export function xFormat(value: any, formatter: (x: any) => any) {
  return xEmpty(value) || formatter(value)
}