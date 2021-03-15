import { isType } from "./type"

const EMPTIES = [null, undefined, NaN, '']

export type IEmptyOpts = {
    extras?: any[],
    strict?: boolean,
    exclude?: any[],
}

export function xEmpty(value: any, opts: IEmptyOpts = {} ) {
    const { extras = [], strict = true, exclude = [] } = opts
    const filters = [ ...extras, ...EMPTIES ].filter(x => !exclude.includes(x))
    if (strict && isType(value, 'object')) {
      return Object.keys(value).length === 0
    } else if (strict && isType(value, 'array')) {
      return value.length === 0
    } else {
      return filters.includes(value)
    }
}

export function xFormat(value: any, formatter: (x: any) => any) {
  return xEmpty(value) || formatter(value)
}

export function xSingleton<T>(create: (key: string) => T) {
  const clients = {} as { [key in string] : T }
  return new Proxy(clients, {
      get(target, key) {
          const keystr = String(key)
          if (!target[keystr]) {
              target[keystr] = create(keystr)
          }
          return target[keystr]
      }
  })
}