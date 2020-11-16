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

  // 可以获得更多的 typeOf 类型
export function xType(value: any): string {
    return Object.prototype.toString.call(value).slice(8, -1).toLocaleLowerCase()
}

export function xIsType<T>(value: any, mtype: string): value is T {
  return xType(value) === mtype
}

const EMPTIES = [null, undefined, NaN, '']

type IEmptyOpts = {
    extras?: any[],
    strict?: boolean,
}

export function xEmpty(value: any, opts: IEmptyOpts = {} ) {
    const { extras = [], strict = true } = opts
    const filters = [ ...extras, ...EMPTIES ]
    const type = xType(value)
    if (strict && ['object'].includes(type)) {
      return Object.keys(value).length === 0
    } else if (strict && ['array'].includes(type)) {
      return value.length === 0
    } else {
      return filters.includes(value)
    }
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
