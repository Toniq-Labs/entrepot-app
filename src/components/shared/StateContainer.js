import React from 'react';
import { makeStyles } from '@material-ui/core';
import { cssToReactStyleObject, toniqColors, toniqFontStyles } from '@toniq-labs/design-system';

export function StateContainer(props) {
	const useStyles = makeStyles(() => ({
		stateContainer: {
			display: props.show ? 'flex' : 'none',
			justifyContent: 'center',
			alignItems: 'center',
			background: '#FFFFFF',
			border: `1px ${toniqColors.pageInteraction.foregroundColor} solid`,
			borderRadius: '8px',
			padding: '12px 16px',
			width: 'max-content',
			marginLeft: 'auto',
			marginRight: 'auto',
			marginTop: 32,
			...cssToReactStyleObject(toniqFontStyles.boldParagraphFont),
			textAlign: 'center',
		},
	}));
	const classes = useStyles();

  return (
		<div ref={props.innerRef} className={classes.stateContainer}>
			{props.children}
		</div>
	);
}
