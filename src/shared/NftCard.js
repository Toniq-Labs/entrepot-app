import React from 'react';
import {css} from 'element-vir';
import {unsafeCSS} from 'lit';
import {toniqColors, cssToReactStyleObject} from '@toniq-labs/design-system';
import {DropShadowCard} from './DropShadowCard';
import {EntrepotNftDisplayReact} from '../typescript/ui/elements/common/toniq-entrepot-nft-display.element';

export function NftCard(props) {
    const styles = cssToReactStyleObject(css`
        border-radius: 16px;
        background-color: ${toniqColors.pagePrimary.backgroundColor};
        padding: ${unsafeCSS(props.small ? '8px' : '16px')};
        cursor: pointer;
        display: flex;
        flex-direction: ${props.listStyle ? css`row` : css`column`};
        align-items: center;
        display: flex;
    `);

    const contentStyles = cssToReactStyleObject(css`
        width: 100%;
        max-width: 100%;
        display: flex;
        flex-direction: column;
    `);

    return (
        <DropShadowCard
            onClick={props.onClick}
            className={`${props.className} nft-card-drop-shadow-card`}
            enableHover={true}
            style={{...styles, ...props.style}}
        >
            <div
                style={{
                    display: 'flex',
                    position: 'relative',
                }}
            >
                <EntrepotNftDisplayReact
                    max={props.max}
                    min={props.min}
                    collectionId={props.collectionId}
                    nftIndex={props.nftIndex}
                    nftId={props.nftId}
                    fullSize={false}
                    cachePriority={props.cachePriority}
                />
                {props.offer}
            </div>
            <div style={contentStyles}>{props.children}</div>
        </DropShadowCard>
    );
}
