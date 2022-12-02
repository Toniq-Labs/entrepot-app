import {StyledTab, StyledTabs} from '../../components/shared/PageTab';
import {useNavigate} from 'react-router-dom';
import {GridDots24Icon, LayoutGrid24Icon} from '@toniq-labs/design-system';
import {ToniqIcon} from '@toniq-labs/design-system/dist/esm/elements/react-components';
import {makeStyles} from '@material-ui/core';

export function ListingsTabs(props) {
    const {collection, gridSize, setGridSize, storeUserPreferences, forceCheck} = props;
    const navigate = useNavigate();
    const classes = useStyles();

    return (
        <>
            <StyledTabs
                value={'nfts'}
                indicatorColor="primary"
                textColor="primary"
                onChange={(e, tab) => {
                    if (tab === 'activity') navigate(`/marketplace/${collection?.route}/activity`);
                }}
            >
                <StyledTab value="nfts" label="NFTs" />
                <StyledTab value="activity" label="Activity" />
                <div className={classes.viewControllerWrapper}>
                    <ToniqIcon
                        icon={LayoutGrid24Icon}
                        onClick={() => {
                            setGridSize('large');
                            storeUserPreferences('gridSize', 'large');
                            forceCheck();
                        }}
                        style={{
                            color: gridSize === 'large' ? '#000000' : 'gray',
                            cursor: 'pointer',
                        }}
                    />
                    <ToniqIcon
                        icon={GridDots24Icon}
                        onClick={() => {
                            setGridSize('small');
                            storeUserPreferences('gridSize', 'small');
                            forceCheck();
                        }}
                        style={{
                            color: gridSize !== 'large' ? '#000000' : 'gray',
                            cursor: 'pointer',
                        }}
                    />
                </div>
            </StyledTabs>
        </>
    );
}

const useStyles = makeStyles(theme => ({
    viewControllerWrapper: {
        alignItems: 'center',
        gap: '8px',
        display: 'none',
        justifyContent: 'end',
        width: '100%',
        [theme.breakpoints.down('sm')]: {
            display: 'flex',
        },
    },
}));
