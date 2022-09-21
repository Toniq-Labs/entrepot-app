import React from 'react';
import {css} from 'element-vir';
import {
  Filter24Icon,
  toniqFontStyles,
  X24Icon,
  toniqColors,
  ToniqToggleButton,
  ToniqSlider,
} from '@toniq-labs/design-system';
import {ToniqIcon} from '@toniq-labs/design-system/dist/esm/elements/react-components';

const filterPanelWidth = css`304px`;

export function WithFilterPanel(props) {
  return (
    <>
      <style
        dangerouslySetInnerHTML={{
          __html: String(css`
            .with-filter-panel {
              display: flex;
              --toniq-interaction-transition-duration: 0;
              --filter-element-padding: 16px;
            }

            .with-filter-panel .left-filter-panel > * {
              width: calc(${filterPanelWidth} - var(--filter-element-padding));
              box-sizing: border-box;
            }

            .with-filter-panel .left-filter-panel {
              display: flex;
              flex-direction: column;
              align-items: stretch;
              overflow: hidden;
              position: relative;
              flex-shrink: 0;
              transition: 300ms flex-basis, 300ms padding;

              flex-basis: 0;
              padding: 0;
              margin-top: 12px;
              gap: 16px;
            }

            .with-filter-panel .left-filter-panel.show-left-panel {
              flex-basis: ${filterPanelWidth};
            }

            .with-filter-panel .left-filter-panel-header {
              display: flex;
              justify-content: space-between;
              overflow: hidden;
              border-radius: 8px;
              position: relative;
              flex-shrink: 0;
            }

            .with-filter-panel .right-section {
              flex-grow: 1;
            }

            .with-filter-panel .filter-text-and-icon {
              display: flex;
              gap: 8px;
              flex-shrink: 0;
              ${toniqFontStyles.boldParagraphFont};
            }

            .with-filter-panel .close-filter-panel-icon {
              cursor: pointer;
            }

            .with-filter-panel .filter-controls-wrapper {
              display: flex;
              flex-direction: column;
            }

            .with-filter-panel .filter-controls-wrapper > * {
              padding: var(--filter-element-padding) 0;
            }

            .with-filter-panel .filter-controls-wrapper > * > .title {
              ${toniqFontStyles.boldParagraphFont};
              margin-bottom: var(--filter-element-padding);
            }

            .with-filter-panel .filter-controls-wrapper > * + * {
              border-top: 1px solid rgba(0, 0, 0, .16);
            }

            .with-filter-panel .filter-controls-wrapper ${ToniqToggleButton} {
              margin: 8px;
            }
            .with-filter-panel .filter-controls-wrapper ${ToniqSlider} {
              margin: var(--filter-element-padding);
              margin-top: 0;
            }
            .with-filter-panel .filter-controls-wrapper ${ToniqToggleButton} + ${ToniqSlider} {
              margin-top: var(--filter-element-padding);
            }

            .with-filter-panel .controls-row-header {
              margin-bottom: 32px;
            }

            .with-filter-panel .filter-sort-row {
              display: flex;
              align-items: center;
              gap: 16px;
              ${toniqFontStyles.boldParagraphFont};
            }

            .with-filter-panel .filters-trigger {
              display: flex;
              gap: 16px;
            }

            .with-filter-panel .filter-and-icon {
              cursor: pointer;
              gap: 8px;
              flex-shrink: 0;
            }

            .with-filter-panel .other-controls {
              display: flex;
              align-items: center;
              justify-content: space-between;
              flex-grow: 1;
            }

            @media (max-width: 800px) {
              .with-filter-panel {
                flex-direction: column;
              }
              .with-filter-panel .left-filter-panel {
                flex-basis: 0;
                gap: 0;
              }
              .with-filter-panel .left-filter-panel.show-left-panel {
                align-self: stretch;
                flex-basis: auto;
              }
              .with-filter-panel .left-filter-panel > * {
                width: unset;
                box-sizing: border-box;
              }
              .with-filter-panel {
                --filter-element-padding: 16px;
              }
              .with-filter-panel .filter-sort-row {
                flex-direction: column;
                align-items: unset;
              }
              .with-filter-panel .filters-dot-thing {
                opacity: 0;
              }
              .with-filter-panel .other-controls {
                margin-left: 16px;
              }
            }
          `),
        }}
      ></style>

      <div className={`${props.className ?? ''} with-filter-panel`} style={{...props.style}}>
        <div className={`${props.showFilters ? 'show-left-panel' : ''} left-filter-panel`}>
          <div className="left-filter-panel-header">
            <div className="filter-text-and-icon">
              <ToniqIcon icon={Filter24Icon} />
              <span>Filters</span>
            </div>
            <ToniqIcon
              className="close-filter-panel-icon"
              onClick={() => {
                props.onShowFiltersChange(false);
              }}
              icon={X24Icon}
            />
          </div>
          <div className="filter-controls-wrapper">{props.filterControlChildren}</div>
        </div>
        <div className="right-section">
          <div className="controls">
            <div className="filter-sort-row">
              <div className="filters-trigger">
                <div
                  className="filter-and-icon"
                  style={{
                    display: props.showFilters ? 'none' : 'flex',
                  }}
                  onClick={() => {
                    props.onShowFiltersChange(true);
                  }}
                >
                  <ToniqIcon icon={Filter24Icon} />
                  <span>Filters</span>
                </div>
                <span
                  className="filters-dot-thing"
                  style={{
                    display: props.showFilters ? 'none' : 'flex',
                  }}
                >
                  •
                </span>
              </div>
              <div className="other-controls">{props.otherControlsChildren}</div>
            </div>
          </div>
          <div>{props.children}</div>
        </div>
      </div>
    </>
  );
}
