import React, { useState } from 'react';
import {toniqColors, cssToReactStyleObject, toniqFontStyles} from '@toniq-labs/design-system';
import { makeStyles } from '@material-ui/core';
import {randomString} from 'augment-vir';

export function TraitsAccordion(props) {
	const [open, setOpen] = useState(props.open);
	
		const useStyles = makeStyles((theme) => ({
			accordion: {
				borderRadius: "16px",
				backgroundColor: toniqColors.pagePrimary.backgroundColor,
			},
			header: {
				display: "flex",
				position: "relative",
				justifyContent: "space-between",
				cursor: "pointer",
				borderRadius: "8px",
				...cssToReactStyleObject(toniqFontStyles.boldParagraphFont),
			},
			detail: {
				maxHeight: "0",
				transition: "max-height 0.4s cubic-bezier(0.29, -0.01, 0, 0.94)",
				overflow: "hidden",
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
					maxHeight: "max-content",
					overflow: "visible",
					paddingBottom: "0",
				},
				"&:checked~.header .traitCategoryCounter": {
					backgroundColor: toniqColors.pageInteraction.foregroundColor,
					color: "#FFFFFF"
				},
			},
			traitCategoryCounter: {
				display: "flex",
				alignItems: "center",
				justifyContent: "center",
				width: 24,
				height: 24,
				borderRadius: "16px",
				backgroundColor: "#F1F3F6",
				...cssToReactStyleObject(toniqFontStyles.boldLabelFont)
			},
		}));

		const classes = useStyles();
		const id = randomString();
    return (
			<div className={classes.accordion}>
					<input id={id} className={classes.checkbox} type="checkbox" checked={open} onChange={() => {
						setOpen(!open);
						if (props.onOpenAccordionChange) props.onOpenAccordionChange(!open);
					}} />
					<label htmlFor={id} className={`${classes.header} header`}>
						{props.title}
						{props.count ? <span className={`${classes.traitCategoryCounter} traitCategoryCounter`}>{props.count}</span> : ''}
					</label>
					<div className={`${classes.detail} detail`}>
						{props.children}
					</div>
			</div>
    );
}
