import {assign, asyncState, css, html, renderAsyncState} from 'element-vir';
import {
    defineToniqElement,
    LoaderAnimated24Icon,
    toniqColors,
    ToniqIcon,
} from '@toniq-labs/design-system';
import {
    NftImageInputs,
    getNftImageData,
    NftImageDisplayData,
} from '../../../data/canisters/get-nft-image-data';
import {wrapInReactComponent} from '@toniq-labs/design-system/dist/esm/elements/wrap-native-element';
import {DimensionConstraints, VirResizableImage} from '@electrovir/resizable-image-element';
import {PartialAndNullable, wait} from '@augment-vir/common';

// these dimensions are set so that they fit within an NFTCard component size of 300x600
const defaultDimensionConstraint: DimensionConstraints = {
    min: {
        width: 272,
        height: 200,
    },
    max: {
        width: 272,
        height: 456,
    },
};

export const EntrepotNftDisplayElement = defineToniqElement<
    NftImageInputs & PartialAndNullable<DimensionConstraints>
>()({
    tagName: 'toniq-entrepot-nft-display',
    stateInit: {
        imageTemplate: asyncState<NftImageDisplayData>(),
    },
    styles: css`
        :host {
            color: ${toniqColors.pagePrimary.foregroundColor};
            background-color: ${toniqColors.accentSecondary.backgroundColor};
            border-radius: 8px;
            overflow: hidden;
            display: flex;
            justify-content: center;
            align-items: center;
        }

        .size-wrapper {
            display: flex;
            justify-content: center;
            align-items: center;
        }
    `,
    initCallback: () => {
        console.log('getting initialized...');
    },
    renderCallback: ({inputs, state, updateState}) => {
        updateState({
            imageTemplate: {
                createPromise: async () => {
                    await wait(2000);
                    return await getNftImageData(inputs);
                },
                trigger: {...inputs},
            },
        });

        const dimensionConstraints: DimensionConstraints = {
            min: inputs.min ?? defaultDimensionConstraint.min,
            max: inputs.max ?? defaultDimensionConstraint.max,
        };

        const asyncTemplate = renderAsyncState(
            state.imageTemplate,
            html`
                <${ToniqIcon}
                    ${assign(ToniqIcon, {icon: LoaderAnimated24Icon})}
                ></${ToniqIcon}>
            `,
            resolvedValue => html`
                    <${VirResizableImage}
                        ${assign(VirResizableImage, {
                            imageUrl: resolvedValue.url,
                            max: dimensionConstraints.max,
                            min: dimensionConstraints.min,
                            transformSvgJavascript: resolvedValue.transformSvgJavascript ?? '',
                        })}
                    >
                        <${ToniqIcon}
                            ${assign(ToniqIcon, {icon: LoaderAnimated24Icon})}
                            slot="loading"
                        ></${ToniqIcon}>
                    </${VirResizableImage}>
                `,
        );

        const sizeWrapperStyle = css`
            min-width: ${dimensionConstraints.min.width}px;
            min-height: ${dimensionConstraints.min.height}px;
        `;

        return html`
            <div class="size-wrapper" style=${sizeWrapperStyle}>${asyncTemplate}</div>
        `;
    },
});

export const EntrepotNftDisplay = wrapInReactComponent(EntrepotNftDisplayElement);
