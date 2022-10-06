import {makeStyles} from '@material-ui/core';
import {
    ArrowsSort24Icon,
    cssToReactStyleObject,
    toniqColors,
    toniqFontStyles,
} from '@toniq-labs/design-system';
import {
    ToniqDropdown,
    ToniqIcon,
} from '@toniq-labs/design-system/dist/esm/elements/react-components';

const useStyles = makeStyles(theme => ({
    toggleSort: {
        background: 'none',
        padding: 0,
        margin: 0,
        border: 'none',
        font: 'inherit',
        cursor: 'pointer',
        textTransform: 'inherit',
        textDecoration: 'inherit',
        '-webkit-tap-highlight-color': 'transparent',
        ...cssToReactStyleObject(toniqFontStyles.paragraphFont),
        '&:hover': {
            color: toniqColors.pageInteractionHover.foregroundColor,
        },
    },
}));

export function ListingsOtherControls(props) {
    const {
        listings,
        filteredAndSortedListings,
        setSort,
        storeUserPreferences,
        pageListing,
        forceCheck,
        hasRarity,
        sort,
        sortOptions,
        sortType,
        setSortType,
    } = props;
    const classes = useStyles();
    return (
        <>
            <span
                style={{
                    display: 'flex',
                    ...cssToReactStyleObject(toniqFontStyles.paragraphFont),
                    color: toniqColors.pageSecondary.foregroundColor,
                }}
            >
                NFTs&nbsp;{listings ? `(${filteredAndSortedListings.length})` : ''}
            </span>
            <div style={{display: 'flex', gap: 4}}>
                <button
                    className={classes.toggleSort}
                    onClick={() => {
                        sortType === 'asc' ? setSortType('desc') : setSortType('asc');
                        storeUserPreferences('sortType', sortType);
                    }}
                >
                    <ToniqIcon
                        icon={ArrowsSort24Icon}
                        style={{transform: sortType === 'asc' ? 'scaleX(1)' : 'scaleX(-1)'}}
                    />
                </button>
                <ToniqDropdown
                    style={{
                        '--toniq-accent-secondary-background-color': 'transparent',
                        width: 200,
                    }}
                    selectedLabelPrefix="Sort By:"
                    selected={sort}
                    onSelectChange={event => {
                        setSort(event.detail);
                        storeUserPreferences('sortOption', event.detail);
                        pageListing.current = 0;
                        forceCheck();
                    }}
                    options={sortOptions.filter(sortOption => {
                        return sortOption.value.type === 'rarity' && !hasRarity() ? false : true;
                    })}
                />
            </div>
        </>
    );
}
