function pxToNumber(px: string) {
    const num = Number(px.replace("px", ""));
    return num;
};

export function getTextRow(node: HTMLElement, text: string) {
    const clone = node.cloneNode(true) as HTMLElement
    clone.innerHTML = ''
    clone.append(document.createTextNode(text))
    document.body.append(clone);

    const { width } = window.getComputedStyle(node, null);

    clone.style.width = width
    clone.style.height = "auto"
    clone.style.maxHeight = "none"
    clone.style.paddingTop = '0'
    clone.style.paddingBottom = '0'
    clone.style.marginTop = '0'
    clone.style.marginBottom = '0'
    clone.style.position = "fixed"
    clone.style.visibility = "hidden"

    // get line-height
    const style = window.getComputedStyle(clone, null);
    const fontSize = style.fontSize;
    const lineHeight = style.lineHeight === "normal" ? fontSize : style.lineHeight;

    // get row count
    const height = style.height;
    const row = pxToNumber(height) / pxToNumber(lineHeight);

    document.body.removeChild(clone)

    return row;
};
