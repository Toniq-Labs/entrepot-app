import React from 'react';
import {css} from 'element-vir';
import {toniqColors, cssToReactStyleObject, toniqShadows} from '@toniq-labs/design-system';

export function DropShadowCard(props) {
    const styles = css`
        border-radius: 16px;
        background-color: ${toniqColors.pagePrimary.backgroundColor};
        border: 1px solid
            ${props.selected ? toniqColors.pageInteraction.foregroundColor : css`transparent`};
        padding: 16px;
        ${toniqShadows.popupShadow}
    `;

    return (
        <div
            style={{
                ...cssToReactStyleObject(styles),
                ...props.style,
            }}
        >
            {props.children}
        </div>
    );
}
