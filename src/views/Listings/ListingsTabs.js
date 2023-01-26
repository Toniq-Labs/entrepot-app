import {StyledTab, StyledTabs} from '../../components/shared/PageTab';
import {GridDots24Icon, LayoutGrid24Icon} from '@toniq-labs/design-system';
import {ToniqIcon} from '@toniq-labs/design-system/dist/esm/elements/react-components';
import {makeStyles} from '@material-ui/core';

export function ListingsTabs(props) {
    const {
        gridSize,
        setGridSize,
        storeUserPreferences,
        forceCheck,
        currentTab,
        setCurrentTab,
        onTabChange,
    } = props;
    const classes = useStyles();

    return (
        <>
            <StyledTabs
                value={currentTab}
                indicatorColor="primary"
                textColor="primary"
                onChange={(e, tab) => {
                    if (tab !== currentTab) setCurrentTab(tab);
                    if (onTabChange) onTabChange(tab);
                    storeUserPreferences('currentTab', tab);
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
