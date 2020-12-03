import { DeviceTypes, BroswerTypes } from './alias'

// 确保 mobile 端容器最小高度在各个平台下一致
export function initWindowHeight(rootId: string, lock = false) {
    if (!DeviceTypes.isMobile && !rootId) {
        return
    }
    const rootNode = document.getElementById(rootId)
    if (!rootNode) {
        return
    }

    const initInnerHeight = (rootNode: HTMLElement) => {
        // windows 如果不减去两个像素就会出现滚动条
        const heightOffset = DeviceTypes.isWindows ? -2 : 0
        const innerHeight = window.innerHeight
        const height = innerHeight ? innerHeight + heightOffset  + 'px' : '100vh'
        if (!lock) {
            rootNode.style.minHeight = height
        } else {
            rootNode.style.height = height
        }
        
    }

    if (!rootNode.style.minHeight) {
      // 初始化 min height， 主要目的为兼容 safari 的 innerHeight
      initInnerHeight(rootNode)
      window.addEventListener('resize', () => {
        initInnerHeight(rootNode)
      })
    } else if (BroswerTypes.isWechatWebview) {
      // WORKAROUND 兼容 wechat 内置浏览器路由切换时 innerHeight 不一致的问题, 路由延迟大概 100 ms
      // 即 100ms 后才能取得正确的高度, 未测试 resize 是否能正确触发
      setTimeout(() => {
        initInnerHeight(rootNode)
      }, 100)
    }
    
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
