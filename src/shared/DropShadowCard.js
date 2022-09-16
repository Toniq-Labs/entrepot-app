import React, {useState} from 'react';
import {css} from 'element-vir';
import {toniqColors, cssToReactStyleObject, toniqShadows} from '@toniq-labs/design-system';

export function DropShadowCard(props) {
  const [hovered, setHovered] = useState(false);

  const styles = css`
    border-radius: 16px;
    background-color: ${toniqColors.pagePrimary.backgroundColor};
    border: 1px solid ${hovered ? toniqColors.pageInteraction.foregroundColor : css`transparent`};
    padding: 16px;
    cursor: ${props.enableHover ? css`pointer` : css`auto`};
    will-change: filter;
    ${toniqShadows.popupShadow}
  `;

  function onHover(hovered) {
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
      onClick={props.onClick}
      className={props.className}
    >
      {props.children}
    </div>
  );
}
