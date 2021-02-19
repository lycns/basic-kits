import { xDate } from "./type"

type ISampleParser = {
    [key: string]: (value: string) => [boolean, any]
}

function isDateString(value: string) {
    return isNaN(Number(value)) && !isNaN(Date.parse(value.replace(/-/g, '/')))
}
const sampleParser: ISampleParser = {
    number: (value: string) => [!!value && !isNaN(Number(value)), Number(value)],
    boolean: (value: string) => [['true', 'false'].includes(value), value === 'true' ? true : false],
    string: (value: string) => [true, value],
    date: (value: string) => [isDateString(value), xDate(value)],
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

function tryParse(value: string) {
    try {
        if (isDateString(value)) {
            return xDate(value)
        }
        return JSON.parse(value)
    } catch(e) {
        return value
    }
}

// 
// export const toChars = {
//     /**
//  * 转全角字符
//  */
// DBC(str: any){
//     let result = "";
//     const len = str.length;
//     for(let i = 0; i < len; i++) {
//         let cCode = str.charCodeAt(i);
//         //全角与半角相差（除空格外）：65248(十进制)
//         cCode = (cCode>=0x0021 && cCode<=0x007E) ? (cCode + 65248) : cCode;
//         //处理空格
//         cCode = (cCode==0x0020) ? 0x03000 : cCode;
//         result += String.fromCharCode(cCode);
//     }
//     return result;
// },
// /**
//  * 转半角字符
//  */
// SBC(str: any){
//     let result = "";
//     const len = str.length;
//     for(let i = 0; i < len; i++)
//     {
//         let cCode = str.charCodeAt(i);
//         //全角与半角相差（除空格外）：65248（十进制）
//         cCode = (cCode　>=　0xFF01 && cCode<=0xFF5E　)　?　(cCode - 65248) : cCode;
//         //处理空格
//         console.log(cCode)
//         cCode = (cCode==0x03000)　?　0x0020　:　cCode;
//         result += String.fromCharCode(cCode);
//     }
//     return result;
// }
// }

