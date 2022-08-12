import React, { useState } from 'react';
import {toniqColors, cssToReactStyleObject, ChevronDown24Icon, toniqFontStyles} from '@toniq-labs/design-system';
import { ToniqIcon } from '@toniq-labs/design-system/dist/esm/elements/react-components';
import { makeStyles } from '@material-ui/core';
import {randomString} from 'augment-vir';



export function Accordion(props) {
	const [open, setOpen] = useState(props.open);
	
		const useStyles = makeStyles((theme) => ({
			accordion: {
				borderRadius: "16px",
				backgroundColor: toniqColors.pagePrimary.backgroundColor,
			},
			header: {
				display: "flex",
				position: "relative",
				justifyContent: "center",
				cursor: "pointer",
				borderRadius: "8px",
				...cssToReactStyleObject(toniqFontStyles.boldParagraphFont),
			},
			detail: {
				maxHeight: "0",
				transition: "max-height 0.4s cubic-bezier(0.29, -0.01, 0, 0.94)",
				overflow: "hidden",
				paddingBottom: "16px",
			},
			icon: {
				position: "absolute",
				right: "0",
				color: "#000000",
				transition: "all .4s",
			},
			checkbox: {
				display: "none",
				"&:checked~.detail": {
					maxHeight: "3000px",
					overflow: "visible",
					paddingBottom: "0",
				},
				"&:checked~.header .icon": {
					transform: "rotate(180deg)",
				}
			}
		}));

		const classes = useStyles();
		const id = randomString();
    return (
			<div className={classes.accordion}>
					<input id={id} className={classes.checkbox} type="checkbox" checked={open} onChange={() => {
						setOpen(!open)
					}} />
					<label htmlFor={id} className={`${classes.header} header`}>
						{props.title}
						<ToniqIcon icon={ChevronDown24Icon} className={`${classes.icon} icon`} />
					</label>
					<div className={`${classes.detail} detail`}>
						{props.children}
					</div>
			</div>
    );
}
