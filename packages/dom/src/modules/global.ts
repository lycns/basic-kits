
let uploader: HTMLInputElement | null = null

type IInputFileOpts = {
    accept?: 'image/*' | string;
}

export function getInputFile(opts: IInputFileOpts = {}) {
    return new Promise((resolve, reject) => {
        if (uploader) {
            uploader.remove()
            uploader = null
        }
        
        uploader = createGlobalElement('input', opts)
        uploader.setAttribute('type', 'file')

        uploader.onchange = function(e) {
            resolve(e)
            uploader?.remove()
        }
        uploader.click()
        document.body.appendChild(uploader)
    })
}

function createGlobalElement<
    T extends { [key in string]?: string }, 
    K extends keyof HTMLElementTagNameMap,
>(name: K, attrs?: T): HTMLElementTagNameMap[K] {
    const el = document.createElement(name)
    if (attrs) {
        for (const key of Object.keys(attrs)) {
            el.setAttribute(key, attrs[key as keyof T]!)
        }
    }
    el.style.opacity = '0'
    el.style.pointerEvents = 'none'
    el.style.position = 'absolute'
    el.style.zIndex = '-1'
    el.style.top = '0'
    return el
}
