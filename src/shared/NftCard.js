import React, {useState, useEffect} from 'react';
import {css} from 'element-vir';
import {unsafeCSS} from 'lit';
import {toniqColors, cssToReactStyleObject} from '@toniq-labs/design-system';
import {DropShadowCard} from './DropShadowCard';
import {convertTemplateToString} from '../typescript/augments/lit';

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

    const imageWrapperStyles = cssToReactStyleObject(css`
        overflow: hidden;
        border-radius: 8px;
        position: relative;
        flex-shrink: 0;
        max-height: 100%;
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

    const [
        imageTemplate,
        setImageTemplate,
    ] = useState('');

    useEffect(async () => {
        const template = await props.imageTemplate;
        const templateString =
            typeof template === 'string' ? template : convertTemplateToString(template);
        console.log({templateString, template});
        setImageTemplate(templateString);
    }, [props.imageTemplate]);

    return (
        <DropShadowCard
            onClick={props.onClick}
            className={props.className}
            enableHover={true}
            style={{...styles, ...props.style}}
        >
            <style
                dangerouslySetInnerHTML={{
                    __html: `
                        .nft-card-image-wrapper > * {
                            display: block;
                            object-fit: cover;
                            width: 100%;
                            max-height: 100%;
                            max-width: 100%;
                        }`,
                }}
            ></style>
            {
                <div
                    className="nft-card-image-wrapper"
                    dangerouslySetInnerHTML={{
                        __html: imageTemplate,
                    }}
                    style={imageWrapperStyles}
                ></div>
            }
            <div style={contentStyles}>{props.children}</div>
        </DropShadowCard>
    );
}
