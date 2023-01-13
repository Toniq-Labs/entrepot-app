export function createResizableSvg(originalSvg: string): string {
    const svgWrapper = document.createElement('div');
    svgWrapper.innerHTML = originalSvg;
    const svgElement = svgWrapper.querySelector('svg')!;

    const width = Number(svgElement.getAttribute('width')?.replace(/px$/, ''));
    const height = Number(svgElement.getAttribute('height')?.replace(/px$/, ''));
    if (!isNaN(width) && !isNaN(height) && !svgElement.hasAttribute('viewBox')) {
        svgElement.setAttribute('viewBox', `0 0 ${width} ${height}`);
    }
    svgElement.removeAttribute('width');
    svgElement.removeAttribute('height');
    svgElement.style.removeProperty('width');
    svgElement.style.removeProperty('height');

    return svgWrapper.innerHTML;
}

export async function getImageHTML({nftLinkUrl}: {nftLinkUrl: string}): Promise<string> {
    return `<img src="${nftLinkUrl}" />`;
}
