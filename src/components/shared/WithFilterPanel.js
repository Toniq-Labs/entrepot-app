import React from 'react';
import {css} from 'element-vir';
import {unsafeCSS} from 'lit';
import {cssToReactStyleObject} from '@toniq-labs/design-system';

const filterPanelWidth = css`320px`;

const filterPanelStyles = cssToReactStyleObject(css`
  overflow: hidden;
  border-radius: 8px;
  position: relative;
  flex-shrink: 0;
  width: ${filterPanelWidth};
  max-width: 50%;
`);

const styles = cssToReactStyleObject(css`
  display: flex;
`);

const rightSectionStyles = cssToReactStyleObject(css`
  flex-grow: 1;
`);

const growAndShrinkPanel = cssToReactStyleObject(css`
    overflow: hidden;
    position: relative;
    flex-shrink: 0;
    transition: 500ms width, 500ms flex-basis;
`);

export function WithFilterPanel(props) {
  return (
    <div className={props.className} style={{...styles, ...props.style}}>
      <div style={{
        ...growAndShrinkPanel,
        width: props.showFilterPanel ? String(filterPanelWidth) : 0,
        flexBasis: props.showFilterPanel ? String(filterPanelWidth) : 0,
      }}>
        <div
          style={{
            ...filterPanelStyles,
            left: props.showFilterPanel ? 0 : `calc(-${String(filterPanelWidth)} - 100px)`,
          }}
        >
          derp
          <span onClick={() => props.onFilterClose()}>X</span>
        </div>
      </div>
      <div style={rightSectionStyles}>{props.children}</div>
    </div>
  );
}
