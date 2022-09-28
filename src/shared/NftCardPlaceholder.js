import React from 'react';
import {css} from 'element-vir';
import {toniqColors, cssToReactStyleObject} from '@toniq-labs/design-system';
import {DropShadowCard} from './DropShadowCard';
import { makeStyles } from '@material-ui/core';

export function NftCardPlaceholder(props) {
  const imageSize = props.small ? css`160px` : css`272px`;
  const listImageSize = css`64px`;
  const imageSizeInUse = props.listStyle ? listImageSize : imageSize;

	const useStyles = makeStyles(theme => ({
		"@keyframes loading": {
			"to": {
				backgroundPosition: "300% 0",
			}
		},
		container: {
			borderRadius: '16px',
			backgroundColor: toniqColors.pagePrimary.backgroundColor,
			padding: '16px',
			cursor: 'pointer',
			display: 'flex',
			flexDirection: props.listStyle ? 'row' : 'column',
			alignItems: 'center',
			"&::after": {
				content: '""',
				position: 'absolute',
				display: 'block',
				left: 0,
				top: 0,
				width: '100%',
				height: '100%',
				borderRadius: '4px',
				backgroundImage: "linear-gradient(90deg, rgba(246, 247, 248, 0) 0, rgba(246, 247, 248, 0.4) 20%, rgba(246, 247, 248, 0.4) 40%, rgba(246, 247, 248, 0) 100%)",
				backgroundSize: "200px 100%",
				backgroundPosition: "-150% 0",
				pointerEvents: 'none',
				backgroundRepeat: 'no-repeat',
				'-webkit-animation': "$loading 1.5s infinite 0s ease-out",
				animation: "$loading 1.5s infinite 0s ease-out",
			}
		}
	}));

	const classes = useStyles();

  const imageStyles = cssToReactStyleObject(css`
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
    width: 272px;
    max-width: 100%;
    flex-grow: 1;
    display: flex;
    flex-direction: column;
  `);

  return (
    <DropShadowCard
      className={classes.container}
      enableHover={true}
      style={{...props.style}}
    >
      <div style={imageWrapperStyles}>
        <div style={imageStyles} />
      </div>
      <div style={contentStyles}>{props.children}</div>
    </DropShadowCard>
  );
}
