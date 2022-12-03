import {makeStyles} from '@material-ui/core';
import {
    ArrowsSortAscending24Icon,
    ArrowsSortDescending24Icon,
    cssToReactStyleObject,
    Filter24Icon,
    GridDots24Icon,
    LayoutGrid24Icon,
    Search24Icon,
    toniqColors,
    toniqFontStyles,
} from '@toniq-labs/design-system';
import {
    ToniqDropdown,
    ToniqIcon,
    ToniqInput,
    ToniqToggleButton,
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
    filterTextAndIcon: {
        display: 'flex',
        gap: 8,
        flexShrink: 0,
        ...cssToReactStyleObject(toniqFontStyles.boldParagraphFont),
    },
    shadowWrapper: {
        display: 'flex',
        width: '100%',
        gap: 24,
        height: 40,
        [theme.breakpoints.down('sm')]: {
            gap: 12,
        },
    },
    sortWrapper: {
        display: 'flex',
        gap: 4,
        justifyContent: 'center',
        alignItems: 'center',
        [theme.breakpoints.down('sm')]: {
            display: 'none',
        },
    },
    viewControllerWrapper: {
        display: 'flex',
        alignItems: 'center',
        gap: '8px',
        [theme.breakpoints.down('sm')]: {
            display: 'none',
        },
    },
}));

export function ListingsOtherControls(props) {
    const {
        setSort,
        storeUserPreferences,
        pageListing,
        forceCheck,
        hasRarity,
        sort,
        sortOptions,
        sortType,
        setSortType,
        gridSize,
        setGridSize,
        query,
        setSearchParams,
        showFilters,
        setShowFilters,
    } = props;
    const classes = useStyles();
    return (
        <div className={classes.shadowWrapper}>
            <ToniqToggleButton
                className="toniq-toggle-button-text-only"
                toggled={showFilters}
                text={'Filters'}
                icon={Filter24Icon}
                onClick={() => {
                    setShowFilters(!showFilters);
                }}
            ></ToniqToggleButton>
            <ToniqInput
                value={query}
                style={{
                    flexGrow: '1',
                }}
                className="toniq-input-outline"
                placeholder="Search for mint # or token ID..."
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
            <div className={classes.sortWrapper}>
                <button
                    className={classes.toggleSort}
                    onClick={() => {
                        sortType === 'asc' ? setSortType('desc') : setSortType('asc');
                        storeUserPreferences('sortType', sortType === 'asc' ? 'desc' : 'asc');
                    }}
                >
                    {sortType === 'asc' ? (
                        <ToniqIcon icon={ArrowsSortAscending24Icon} />
                    ) : (
                        <ToniqIcon icon={ArrowsSortDescending24Icon} />
                    )}
                </button>
                <ToniqDropdown
                    style={{
                        '--toniq-accent-secondary-background-color': 'transparent',
                        width: 'unset',
                    }}
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
        </div>
    );
}
