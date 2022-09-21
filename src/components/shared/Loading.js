import React from 'react';
import { makeStyles } from '@material-ui/core';
import { cssToReactStyleObject, LoaderAnimated24Icon, toniqFontStyles } from '@toniq-labs/design-system';
import { ToniqIcon } from '@toniq-labs/design-system/dist/esm/elements/react-components';

export function Loading(props) {
	const useStyles = makeStyles(theme => ({
		loadingContainer: {
			display: props.loading ? 'flex' : 'none',
			justifyContent: 'center',
			alignItems: 'center',
			background: '#FFFFFF',
			border: '1px #00D093 solid',
			borderRadius: '8px',
			padding: '12px 16px',
			maxWidth: '138px',
			marginLeft: 'auto',
			marginRight: 'auto',
			...cssToReactStyleObject(toniqFontStyles.boldParagraphFont)
		},
	}));
	const classes = useStyles();

  return (
		<div className={classes.loadingContainer}>
			<ToniqIcon icon={LoaderAnimated24Icon} />&nbsp;Loading...
		</div>
	);
}
