import React from 'react';
import {css} from 'element-vir';
import {unsafeCSS} from 'lit';
import {toniqColors, cssToReactStyleObject} from '@toniq-labs/design-system';
import {DropShadowCard} from './DropShadowCard';
import {useState} from 'react';

const imageSize = css`272px`;

const imageWrapperStyles = cssToReactStyleObject(css`
  overflow: hidden;
  border-radius: 8px;
  position: relative;
  flex-shrink: 0;
  height: ${imageSize};
  width: ${imageSize};
  max-width: 100%;
`);

const imageOverlayStyles = cssToReactStyleObject(css`
  position: absolute;
`);

const contentStyles = cssToReactStyleObject(css`
  width: ${imageSize};
  max-width: 100%;
  flex-grow: 1;
  display: flex;
  flex-direction: column;
`);

export function NftCard(props) {
  const [hovered, setHovered] = useState(false);

  const styles = cssToReactStyleObject(css`
    border-radius: 16px;
    background-color: ${toniqColors.pagePrimary.backgroundColor};
    border: 1px solid ${hovered ? toniqColors.pageInteraction.foregroundColor : css`transparent`};
    padding: 16px;
    cursor: pointer;
    display: flex;
    flex-direction: column;
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

  return (
    <DropShadowCard
      className={props.className}
      style={{...styles, ...props.style}}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      <div style={imageWrapperStyles}>
        <div style={imageStyles} />
        <div style={imageOverlayStyles}>{props.imageOverlay}</div>
      </div>
      <div style={contentStyles}>{props.children}</div>
    </DropShadowCard>
  );
}
