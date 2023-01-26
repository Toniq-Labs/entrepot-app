import {html} from 'element-vir';
import {TemplateResult} from 'lit';
import {unsafeSVG} from 'lit/directives/unsafe-svg.js';
import axios from 'axios';

export type SvgOptions = {
    replaceAttributeValues: ReadonlyArray<{
        attribute: string;
        replaceThis: string | RegExp;
        withThis: string;
    }>;
};

export async function createResizableSvg(
    svgUrl: string,
    options?: SvgOptions,
): Promise<TemplateResult> {
    const response = await axios(svgUrl);
    const originalSvg = response.data;

    const svgWrapper = document.createElement('div');
    svgWrapper.innerHTML = originalSvg;
    const svgElement: SVGSVGElement = svgWrapper.querySelector('svg')!;

    const width = Number(svgElement.getAttribute('width')?.replace(/px$/, ''));
    const height = Number(svgElement.getAttribute('height')?.replace(/px$/, ''));
    if (!isNaN(width) && !isNaN(height) && !svgElement.hasAttribute('viewBox')) {
        svgElement.setAttribute('viewBox', `0 0 ${width} ${height}`);
    }
    svgElement.removeAttribute('width');
    svgElement.removeAttribute('height');
    svgElement.style.removeProperty('width');
    svgElement.style.removeProperty('height');

    applySvgOptions(svgElement, options);

    return unsafeSVG(svgWrapper.innerHTML) as TemplateResult;
}

// this mutates the element
function applySvgOptions(svgElement: SVGSVGElement, options?: SvgOptions): void {
    if (!options) {
        return;
    }

    if (options.replaceAttributeValues) {
        options.replaceAttributeValues.forEach(replaceOptions => {
            const newValue = svgElement
                .getAttribute(replaceOptions.attribute)
                ?.replace(replaceOptions.replaceThis, replaceOptions.withThis);

            if (newValue) {
                svgElement.setAttribute(replaceOptions.attribute, newValue);
            } else {
                svgElement.removeAttribute(replaceOptions.attribute);
            }
        });
    }
}
