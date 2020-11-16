
export function getDeviceTypes(ua: string) {
    return {
        isMobile: /AppleWebKit.*Mobile.*/i.test(ua),
        isIOS: /(iPhone|iPod|iPad);?/i.test(ua),
        isAndroid: /Android/i.test(ua),
        isIPad: /iPad/i.test(ua),
        isMac: /macintosh|mac os x/i.test(ua),
        isWindows: /windows|win32/i.test(ua),
        isWinPhone: /Windows Phone/i.test(ua),
    } as const
}
