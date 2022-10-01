import {GridDots24Icon, LayoutGrid24Icon, Search24Icon} from '@toniq-labs/design-system';
import {ToniqIcon, ToniqInput} from '@toniq-labs/design-system/dist/esm/elements/react-components';
import {StyledTab, StyledTabs} from '../../components/shared/PageTab';
import {forceCheck} from 'react-lazyload';
import {useNavigate} from 'react-router-dom';

export function ListingsTabs(props) {
    const {collection, gridSize, setGridSize, query, setSearchParams, storeUserPreferences} = props;
    const navigate = useNavigate();

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
            </StyledTabs>
            <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center'}}>
                <ToniqInput
                    value={query}
                    style={{
                        '--toniq-accent-tertiary-background-color': 'transparent',
                        maxWidth: '300px',
                        boxSizing: 'border-box',
                        flexGrow: '1',
                        marginLeft: '-16px',
                    }}
                    placeholder="Search for mint # or token ID"
                    icon={Search24Icon}
                    onValueChange={event => {
                        const search = event.detail;
                        if (search) {
                            setSearchParams({search});
                        } else {
                            setSearchParams({});
                        }
                    }}
                />
                <div style={{display: 'flex', gap: '8px'}}>
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
            </div>
        </>
    );
}
