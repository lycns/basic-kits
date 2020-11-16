import { 
    getBrowserType, 
    BrowserType, 
    getBrowserVersion, 
    getDeviceTypes,
} from '@basic-kits/ua'

const ua = navigator.userAgent
export const BROWSER_TYPE = getBrowserType(ua)
export const BROWSER_VERSION = getBrowserVersion(ua)

export const DeviceTypes = getDeviceTypes(ua)
export const BroswerTypes = {
    isWechatWebview: BROWSER_TYPE === BrowserType.WeChatWebView,
    isQQWebView: BROWSER_TYPE === BrowserType.QQWebView,
}