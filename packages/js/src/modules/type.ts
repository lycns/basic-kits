import { IEmptyOpts, xEmpty } from "./base"

// 可以获得更多的 typeOf 类型
export function xType(value: any): string {
    return Object.prototype.toString.call(value).slice(8, -1).toLocaleLowerCase()
}

export const isType = {
  object: (value: any): value is object => xType(value) === 'object',
  number: (value: any): value is number => xType(value) === 'number',
  string: (value: any): value is string => xType(value) === 'string',
  boolean: (value: any): value is boolean => xType(value) === 'boolean',
  symbol: (value: any): value is symbol => xType(value) === 'symbol',
  date: (value: any): value is Date => xType(value) === 'date',
  array: <T = any>(value: any): value is T[] => Array.isArray(value),
  promise: <T = any>(value: any): value is Promise<T> => xType(value) === 'promise' || (typeof value === 'function' && !!value.then),
  function: <T = any, U extends any[] = any>(value: any): value is ((...any: U) => T) => xType(value) === 'function',
  any: <T = any>(value: any, type: string): value is T => xType(value) === type,
}

// 数组归一化, 转换成一个元素类型一致且没有空元素的数组
export function xArray<T>(value?: T | T[], opts: IEmptyOpts = {} ): T[] {
    const empty = [] as T[]
    if (!value) {
      return empty
    }
    return empty.concat(value).filter(v => !xEmpty(v, opts))
  }

// 处理 date 类型的兼容
export function xDate(value: Date | string | number): Date {
    const param = typeof value === 'string' ? value.replace(/-/g, '/') : value
    return new Date(param)
}

export function xObject<T>(obj: T, opts: IEmptyOpts = {} ): Partial<T> {
    const newObj = {} as Partial<T>
    if (!obj) {
      return newObj
    }
    for (const key of Object.keys(obj)) {
      const value = (obj as any)[key]
      if (!xEmpty(value, opts)) {
          (newObj as any)[key] = value
      }
    }
    return newObj
  }
