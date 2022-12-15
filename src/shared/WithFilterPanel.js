import React from 'react';
import {css} from 'element-vir';
import {toniqFontStyles, ToniqToggleButton, ToniqSlider} from '@toniq-labs/design-system';

const filterPanelWidth = css`304px`;
const filterPanelStickyHeight = css`174px`;

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
                            top: ${filterPanelStickyHeight};
                            height: calc(100vh - ${filterPanelStickyHeight});
                            position: sticky;
                            overflow-x: hidden;
                            overflow-y: hidden;
                            flex-shrink: 0;
                            transition: 300ms flex-basis, 300ms padding;

                            flex-basis: 0;
                            padding: 0;
                            gap: 16px;
                            scrollbar-width: none;
                        }

                        .with-filter-panel .left-filter-panel:hover {
                            overflow-y: scroll;
                        }

                        .with-filter-panel .left-filter-panel.show-left-panel {
                            flex-basis: ${filterPanelWidth};
                            -ms-overflow-style: none;
                            scrollbar-width: none;
                        }

                        .with-filter-panel .left-filter-panel.show-left-panel::-webkit-scrollbar {
                            display: none;
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
                            border-top: 1px solid rgba(0, 0, 0, 0.16);
                        }

                        .with-filter-panel .filter-controls-wrapper ${ToniqToggleButton} {
                            margin: 8px;
                        }
                        .with-filter-panel .filter-controls-wrapper ${ToniqSlider} {
                            margin: var(--filter-element-padding);
                            margin-top: 0;
                        }
                        .with-filter-panel
                            .filter-controls-wrapper
                            ${ToniqToggleButton}
                            + ${ToniqSlider} {
                            margin-top: var(--filter-element-padding);
                        }

                        .controls {
                            position: sticky;
                            top: 70px;
                            z-index: 10;
                        }

                        .other-controls {
                            display: flex;
                            align-items: center;
                            justify-content: space-between;
                            flex-grow: 1;
                            background-color: white;
                            box-shadow: white 0 10px 8px -1px;
                            width: 100vw;
                            margin-left: -32px;
                        }

                        .other-controls:not(:empty) {
                            padding: 32px;
                        }

                        @media (max-width: 800px) {
                            .with-filter-panel {
                                flex-direction: column;
                            }
                            .with-filter-panel .left-filter-panel {
                                flex-basis: 0;
                                gap: 0;
                                overflow-y: scroll;
                                position: relative;
                                height: unset;
                                top: unset;
                            }
                            .with-filter-panel .left-filter-panel:hover {
                                overflow: hidden;
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
            <div style={{display: 'flex', flexDirection: 'column'}}>
                <div className="controls">
                    <div className="other-controls">{props.otherControlsChildren}</div>
                </div>
                <div
                    className={`${props.className ?? ''} with-filter-panel`}
                    style={{...props.style}}
                >
                    <div
                        className={`${
                            props.showFilters ? 'show-left-panel' : ''
                        } left-filter-panel`}
                    >
                        <div className="filter-controls-wrapper">{props.filterControlChildren}</div>
                    </div>
                    <div className="right-section">
                        <div>{props.children}</div>
                    </div>
                </div>
            </div>
        </>
    );
}
