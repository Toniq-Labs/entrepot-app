import React from 'react';
import { makeStyles } from '@material-ui/core';
import { cssToReactStyleObject, toniqFontStyles } from '@toniq-labs/design-system';

export function NoResult(props) {
	const useStyles = makeStyles(() => ({
		noResultContainer: {
			display: props.noResult ? 'flex' : 'none',
			justifyContent: 'center',
			alignItems: 'center',
			background: '#FFFFFF',
			border: '1px #00D093 solid',
			borderRadius: '8px',
			padding: '12px 16px',
			maxWidth: '138px',
			marginLeft: 'auto',
			marginRight: 'auto',
			marginTop: 32,
			...cssToReactStyleObject(toniqFontStyles.boldParagraphFont) 
		},
	}));
	const classes = useStyles();

  return (
		<div className={classes.noResultContainer}>
			<span>No Result</span>
		</div>
	);
}
