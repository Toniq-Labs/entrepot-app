import {makeStyles} from '@material-ui/core';
import {
    ArrowsSortAscending24Icon,
    ArrowsSortDescending24Icon,
    cssToReactStyleObject,
    Search24Icon,
    toniqColors,
    toniqFontStyles,
} from '@toniq-labs/design-system';
import {
    ToniqDropdown,
    ToniqIcon,
    ToniqInput,
} from '@toniq-labs/design-system/dist/esm/elements/react-components';
import {useState} from 'react';

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

export function ListingsOtherControlsActivity(props) {
    const {
        setSort,
        storeUserPreferences,
        hasRarity,
        sort,
        sortOptions,
        query,
        setSearchParams,
        sortTypeActivity,
    } = props;

    const [
        sortType,
        setSortType,
    ] = useState(sortTypeActivity);

    const classes = useStyles();
    return (
        <div className={classes.shadowWrapper}>
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
            <div className={`${classes.hideWhenMobile} ${classes.sortWrapper}`}>
                <button
                    className={classes.toggleSort}
                    onClick={() => {
                        sortType === 'asc' ? setSortType('desc') : setSortType('asc');
                        storeUserPreferences(
                            'sortTypeActivity',
                            sortType === 'asc' ? 'desc' : 'asc',
                        );
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
                    }}
                    options={sortOptions.filter(sortOption => {
                        return sortOption.value.type === 'rarity' && !hasRarity() ? false : true;
                    })}
                />
            </div>
        </div>
    );
}
