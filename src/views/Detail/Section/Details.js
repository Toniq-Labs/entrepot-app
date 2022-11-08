import {makeStyles} from '@material-ui/core';
import React from 'react';

const DetailSectionDetails = props => {
    const classes = useStyles();
    return (
        <div className={classes.detailSectionWrapper}>
            <div className={classes.detailSectionContainer}>1</div>
            <div className={classes.detailSectionContainer}>2</div>
        </div>
    );
};
export default DetailSectionDetails;

const useStyles = makeStyles(theme => ({
    detailSectionWrapper: {
        display: 'flex',
        justifyContent: 'center',
        gap: 28,
        [theme.breakpoints.down('md')]: {
            flexDirection: 'column-reverse',
        },
    },
    sectionContainer: {},
    detailSectionContainer: {
        borderRadius: 16,
        border: '1px solid rgba(0,0,0, 0.08)',
        padding: 24,
        flexGrow: 1,
        [theme.breakpoints.down('md')]: {
            padding: '16px 14px',
        },
    },
}));
