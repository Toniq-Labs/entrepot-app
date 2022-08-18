import React, { useState } from 'react';
import {css} from 'element-vir';
import {toniqColors, cssToReactStyleObject, toniqShadows} from '@toniq-labs/design-system';

export function DropShadowCard(props) {
    const [hovered, setHovered] = useState(false);

    const styles = css`
        border-radius: 16px;
        background-color: ${toniqColors.pagePrimary.backgroundColor};
        border: 1px solid
            ${hovered ? toniqColors.pageInteraction.foregroundColor : css`transparent`};
        padding: 16px;
        cursor: ${props.enableHover && hovered ? css`pointer`: css`auto`};
        ${toniqShadows.popupShadow}
    `;

    const onHover = (hovered) => {
        if (props.enableHover) {
            setHovered(hovered);
        }
    }

    return (
        <div
            style={{
                ...cssToReactStyleObject(styles),
                ...props.style,
            }}
            onMouseEnter={() => onHover(true)}
            onMouseLeave={() => onHover(false)}
            className={props.className}
        >
            {props.children}
        </div>
    );
}
