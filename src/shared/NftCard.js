import React from 'react';
import {css} from 'element-vir';
import {unsafeCSS} from 'lit';
import {toniqColors, cssToReactStyleObject} from '@toniq-labs/design-system';
import {DropShadowCard} from './DropShadowCard';

export function NftCard(props) {
    const imageSize = props.small ? css`160px` : css`272px`;
    const listImageSize = props.listImageSize ? unsafeCSS(props.listImageSize) : css`64px`;
    const imageSizeInUse = props.listStyle ? listImageSize : imageSize;

    const styles = cssToReactStyleObject(css`
        border-radius: 16px;
        background-color: ${toniqColors.pagePrimary.backgroundColor};
        padding: ${unsafeCSS(props.small ? '8px' : '16px')};
        cursor: pointer;
        display: flex;
        flex-direction: ${props.listStyle ? css`row` : css`column`};
        align-items: center;
    `);

    const imageStyles = cssToReactStyleObject(css`
        background-image: url('${unsafeCSS(props.imageUrl)}');
        background-size: cover;
        background-position: center;
        background-repeat: no-repeat;
        height: 100%;
        width: 100%;
    `);

    const imageWrapperStyles = cssToReactStyleObject(css`
        overflow: hidden;
        border-radius: 8px;
        position: relative;
        flex-shrink: 0;
        height: ${imageSizeInUse};
        width: ${imageSizeInUse};
        max-width: 100%;
        background-color: #f1f1f1;
    `);

    const contentStyles = cssToReactStyleObject(css`
        width: 100%;
        max-width: 100%;
        flex-grow: 1;
        display: flex;
        flex-direction: column;
    `);

    return (
        <DropShadowCard
            onClick={props.onClick}
            className={props.className}
            enableHover={true}
            style={{...styles, ...props.style}}
        >
            <div style={imageWrapperStyles}>
                <div style={imageStyles} />
            </div>
            <div style={contentStyles}>{props.children}</div>
        </DropShadowCard>
    );
}
