import {html} from 'element-vir';
import {TemplateResult} from 'lit';
import {unsafeSVG} from 'lit/directives/unsafe-svg.js';
import axios from 'axios';

export async function createResizableSvg(svgUrl: string): Promise<TemplateResult> {
    const response = await axios(svgUrl);
    const originalSvg = response.data;

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

    return unsafeSVG(svgWrapper.innerHTML) as TemplateResult;
}

export async function createImageHTML(imageUrl: string): Promise<TemplateResult> {
    return html`
        <img src="${imageUrl}" />
    `;
}
