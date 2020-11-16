import { DeviceTypes } from './alias'

export function initInnerHeight(rootNode: HTMLElement | null) {
    if (!rootNode) {
        return false
    }
    // windows 如果不减去两个像素就会出现滚动条
    const heightOffset = DeviceTypes.isWindows ? -2 : 0
    const innerHeight = window.innerHeight
    rootNode.style.minHeight = innerHeight ? innerHeight + heightOffset  + 'px' : '100vh'
    return true
}

// 初始化窗口宽度, web 端非响应式兼容时使用，保证窗口自动缩放
export function initWindowWidth() {
    if (!DeviceTypes.isMobile) {
        return
    }
    const initWidth = () => {
        const innerWidth = window.innerWidth ? window.innerWidth + 'px' : '100vw'
        document.getElementsByTagName('html')[0].style.minWidth = innerWidth;
    }
    initWidth()
    window.addEventListener('resize', () => {
        initWidth()
    })
}

type ScrollDirection = 'vertical' | 'horizontal' | 'v' | 'h'
// 是否存在滚动条
export function hasScrollbar(direction: ScrollDirection) {
    if (['h', 'horizontal'].includes(direction)) {
        return document.body.scrollWidth > (window.innerWidth || document.documentElement.clientWidth)
    } else {
        return document.body.scrollWidth > (window.innerWidth || document.documentElement.clientWidth);
    }
}
