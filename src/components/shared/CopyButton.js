import React, {useState} from 'react';
import {Copy24Icon} from '@toniq-labs/design-system';
import {makeStyles, Tooltip} from '@material-ui/core';
import {ToniqIcon} from '@toniq-labs/design-system/dist/esm/elements/react-components';

export function CopyButton(props) {
    const [
        copyState,
        setCopyState,
    ] = useState(props.copyMessage ? props.copyMessage : 'Copy');
    const classes = useStyles();

    const onCopy = event => {
        event.preventDefault();
        navigator.clipboard.writeText(props.text);
        setCopyState('Copied!');
        setTimeout(() => {
            setCopyState(props.copyMessage ? props.copyMessage : 'Copy');
        }, 1500);
    };

    return (
        <Tooltip title={copyState} arrow placement="top">
            <button className={classes.copyBtn} onClick={event => onCopy(event)}>
                <ToniqIcon icon={Copy24Icon} />
            </button>
        </Tooltip>
    );
}

const useStyles = makeStyles(theme => ({
    copyBtn: {
        border: 'none',
        background: 'none',
        cursor: 'pointer',
        padding: 0,
    },
}));
