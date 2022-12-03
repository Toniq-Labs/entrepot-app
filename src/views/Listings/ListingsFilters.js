import {Grid, makeStyles} from '@material-ui/core';
import {
    cssToReactStyleObject,
    Search24Icon,
    toniqColors,
    toniqFontStyles,
} from '@toniq-labs/design-system';
import {
    ToniqCheckbox,
    ToniqInput,
    ToniqSlider,
} from '@toniq-labs/design-system/dist/esm/elements/react-components';
import {Accordion} from '../../components/Accordion';
import {uppercaseFirstLetterOfWord} from '../../utilities/string-utils';
import {EntrepotNFTMintNumber} from '../../utils';

const useStyles = makeStyles(theme => ({
    traitsWrapper: {
        display: 'grid',
        gap: '16px',
    },
    traitsContainer: {
        display: 'grid',
        gap: '32px',
        margin: '32px 0px',
        [theme.breakpoints.down('sm')]: {
            gap: '16px',
            margin: '16px 0px',
        },
    },
    cronicTraitsContainer: {
        ...cssToReactStyleObject(toniqFontStyles.paragraphFont),
        padding: '16px',
        '& toniq-slider': {
            margin: '0 !important',
        },
    },
    filterAccordionWrapper: {
        margin: '32px 0',
        [theme.breakpoints.down('sm')]: {
            margin: '16px 0',
        },
    },
    clearTraitFilter: {
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
        color: toniqColors.pageInteraction.foregroundColor,
        '&:hover': {
            color: toniqColors.pageInteractionHover.foregroundColor,
        },
    },
    traitCounter: {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        width: 'auto',
        minWidth: 24,
        maxHeight: 24,
        padding: 4,
        borderRadius: '16px',
        backgroundColor: '#F1F3F6',
        ...cssToReactStyleObject(toniqFontStyles.boldLabelFont),
        '&.selected': {
            backgroundColor: toniqColors.pageInteraction.foregroundColor,
            color: '#FFFFFF',
        },
    },
}));

export function ListingsFilters(props) {
    const {
        currentFilters,
        filteredStatusListings,
        searchParams,
        setSearchParams,
        openedAccordion,
        setOpenedAccordion,
        filterTypes,
        hasRarity,
        storeUserPreferences,
        traitsData,
        collection,
        traitsCategories,
        setCurrentFilters,
    } = props;
    const classes = useStyles();
    const queryTrait = searchParams.get('searchTrait') || '';

    const queryFilteredTraits = traitsCategoryValues => {
        return traitsCategoryValues.filter(trait => {
            const inQuery = trait.toString().toLowerCase().indexOf(queryTrait.toLowerCase()) >= 0;
            return queryTrait === '' || inQuery;
        });
    };

    const findCurrentFilterTraitIndex = category => {
        return currentFilters.traits.values.findIndex(trait => {
            return trait.category === category;
        });
    };

    const isTraitSelected = (trait, category) => {
        const traitIndex = findCurrentFilterTraitIndex(category);
        if (traitIndex !== -1) {
            return currentFilters.traits.values[traitIndex].values.includes(trait);
        }
        return false;
    };
    const lowestPrice = filteredStatusListings.reduce((lowest, listing) => {
        const currentValue = Number(listing.price) / 100000000;
        if (currentValue < lowest) {
            return currentValue;
        } else {
            return lowest;
        }
    }, Infinity);

    const highestPrice = filteredStatusListings.reduce((highest, listing) => {
        const currentValue = Number(listing.price) / 100000000;
        if (currentValue > highest) {
            return currentValue;
        } else {
            return highest;
        }
    }, -Infinity);

    const lowestMint = filteredStatusListings.reduce((lowest, listing) => {
        const currentValue = EntrepotNFTMintNumber(listing?.canister, listing?.index);
        if (currentValue < lowest) {
            return currentValue;
        } else {
            return lowest;
        }
    }, Infinity);

    const highestMint = filteredStatusListings.reduce((highest, listing) => {
        const currentValue = EntrepotNFTMintNumber(listing?.canister, listing?.index);
        if (currentValue > highest) {
            return currentValue;
        } else {
            return highest;
        }
    }, -Infinity);

    const filterRanges = {
        [filterTypes.price]: {
            min: lowestPrice,
            max: highestPrice,
        },
        [filterTypes.rarity]: {
            min: 0,
            max: 100,
        },
        [filterTypes.mintNumber]: {
            min: lowestMint,
            max: highestMint,
        },
        [filterTypes.traits]: {
            min: 0,
            max: 63,
        },
    };

    const toggleAccordion = currentAccordion => {
        const accordion = [...openedAccordion];
        const accordionIndex = openedAccordion.findIndex(accordion => {
            return accordion === currentAccordion;
        });

        if (accordionIndex !== -1) {
            accordion.splice(accordionIndex, 1);
        } else {
            accordion.push(currentAccordion);
        }

        setOpenedAccordion(accordion);
        storeUserPreferences('openedAccordion', accordion);
    };

    return (
        <>
            <div>
                <Accordion
                    title="Status"
                    open={openedAccordion.includes(filterTypes.status.type)}
                    onOpenAccordionChange={() => {
                        toggleAccordion(filterTypes.status.type);
                    }}
                    disabled={true}
                >
                    <div className={classes.filterAccordionWrapper}>
                        <div
                            style={{
                                display: 'flex',
                                flexDirection: 'column',
                                marginLeft: 8,
                                gap: 24,
                            }}
                        >
                            <ToniqCheckbox
                                checked={currentFilters.status[filterTypes.status.listed] === true}
                                onCheckedChange={event => {
                                    if (
                                        event.detail === false &&
                                        currentFilters.status[filterTypes.status.unlisted] === false
                                    )
                                        return;
                                    var filterOptions = {
                                        ...currentFilters,
                                        status: {
                                            ...currentFilters.status,
                                            [filterTypes.status.listed]: event.detail,
                                        },
                                    };
                                    setCurrentFilters(filterOptions);
                                    storeUserPreferences('filterOptions', filterOptions);
                                }}
                            >
                                Listed
                            </ToniqCheckbox>
                            <ToniqCheckbox
                                checked={
                                    currentFilters.status[filterTypes.status.unlisted] === true
                                }
                                onCheckedChange={event => {
                                    if (
                                        event.detail === false &&
                                        currentFilters.status[filterTypes.status.listed] === false
                                    )
                                        return;
                                    var filterOptions = {
                                        ...currentFilters,
                                        status: {
                                            ...currentFilters.status,
                                            [filterTypes.status.unlisted]: event.detail,
                                        },
                                    };
                                    setCurrentFilters(filterOptions);
                                    storeUserPreferences('filterOptions', filterOptions);
                                }}
                            >
                                Unlisted
                            </ToniqCheckbox>
                        </div>
                    </div>
                </Accordion>
            </div>
            {filterRanges[currentFilters.price.type].min !== Infinity &&
                filterRanges[currentFilters.price.type].max !== Infinity && (
                    <div>
                        <Accordion
                            title="Price"
                            open={openedAccordion.includes(filterTypes.price)}
                            onOpenAccordionChange={() => {
                                toggleAccordion(filterTypes.price);
                            }}
                            disabled={true}
                        >
                            <div className={classes.filterAccordionWrapper}>
                                <div
                                    style={{
                                        display: 'flex',
                                        padding: '0 8px',
                                        gap: 8,
                                    }}
                                >
                                    <ToniqInput
                                        className="toniq-input-outline"
                                        placeholder="Min"
                                        value={
                                            currentFilters.price.min === undefined
                                                ? ''
                                                : currentFilters.price.min.toString()
                                        }
                                        onValueChange={event => {
                                            const values = Number(event.detail);
                                            if (!isNaN(values)) {
                                                var filterOptions = {
                                                    ...currentFilters,
                                                    price: {
                                                        ...currentFilters.price,
                                                        min: values,
                                                    },
                                                };
                                                setCurrentFilters(filterOptions);
                                                storeUserPreferences(
                                                    'filterOptions',
                                                    filterOptions,
                                                );
                                            }
                                        }}
                                    />
                                    <ToniqInput
                                        className="toniq-input-outline"
                                        placeholder="Max"
                                        value={
                                            currentFilters.price.max === undefined
                                                ? ''
                                                : currentFilters.price.max.toString()
                                        }
                                        onValueChange={event => {
                                            const values = Number(event.detail);
                                            if (!isNaN(values)) {
                                                var filterOptions = {
                                                    ...currentFilters,
                                                    price: {
                                                        ...currentFilters.price,
                                                        max: values,
                                                    },
                                                };
                                                setCurrentFilters(filterOptions);
                                                storeUserPreferences(
                                                    'filterOptions',
                                                    filterOptions,
                                                );
                                            }
                                        }}
                                    />
                                </div>
                            </div>
                        </Accordion>
                    </div>
                )}
            {hasRarity() && (
                <div>
                    <Accordion
                        title="Rarity"
                        open={openedAccordion.includes(filterTypes.rarity)}
                        onOpenAccordionChange={() => {
                            toggleAccordion(filterTypes.rarity);
                        }}
                        disabled={true}
                    >
                        <div className={classes.filterAccordionWrapper}>
                            <div
                                style={{
                                    display: 'flex',
                                    padding: '0 8px',
                                    gap: 8,
                                }}
                            >
                                <ToniqInput
                                    className="toniq-input-outline"
                                    placeholder="Min"
                                    value={
                                        currentFilters.rarity.min === undefined
                                            ? ''
                                            : currentFilters.rarity.min.toString()
                                    }
                                    onValueChange={event => {
                                        const values = Number(event.detail);
                                        if (!isNaN(values)) {
                                            var filterOptions = {
                                                ...currentFilters,
                                                rarity: {
                                                    ...currentFilters.rarity,
                                                    min: values,
                                                },
                                            };
                                            setCurrentFilters(filterOptions);
                                            storeUserPreferences('filterOptions', filterOptions);
                                        }
                                    }}
                                />
                                <ToniqInput
                                    className="toniq-input-outline"
                                    placeholder="Max"
                                    value={
                                        currentFilters.rarity.max === undefined
                                            ? ''
                                            : currentFilters.rarity.max.toString()
                                    }
                                    onValueChange={event => {
                                        const values = Number(event.detail);
                                        if (!isNaN(values)) {
                                            var filterOptions = {
                                                ...currentFilters,
                                                rarity: {
                                                    ...currentFilters.rarity,
                                                    max: values,
                                                },
                                            };
                                            setCurrentFilters(filterOptions);
                                            storeUserPreferences('filterOptions', filterOptions);
                                        }
                                    }}
                                />
                            </div>
                        </div>
                    </Accordion>
                </div>
            )}
            {filterRanges[currentFilters.mintNumber.type].min !== Infinity &&
                filterRanges[currentFilters.mintNumber.type].max !== Infinity && (
                    <div>
                        <Accordion
                            title="Mint #"
                            open={openedAccordion.includes(filterTypes.mintNumber)}
                            onOpenAccordionChange={() => {
                                toggleAccordion(filterTypes.mintNumber);
                            }}
                            disabled={true}
                        >
                            <div className={classes.filterAccordionWrapper}>
                                <div
                                    style={{
                                        display: 'flex',
                                        padding: '0 8px',
                                        gap: 8,
                                    }}
                                >
                                    <ToniqInput
                                        className="toniq-input-outline"
                                        placeholder="Min"
                                        value={
                                            currentFilters.mintNumber.min === undefined
                                                ? ''
                                                : currentFilters.mintNumber.min.toString()
                                        }
                                        onValueChange={event => {
                                            const values = Number(event.detail);
                                            if (!isNaN(values)) {
                                                var filterOptions = {
                                                    ...currentFilters,
                                                    mintNumber: {
                                                        ...currentFilters.mintNumber,
                                                        min: values,
                                                    },
                                                };
                                                setCurrentFilters(filterOptions);
                                                storeUserPreferences(
                                                    'filterOptions',
                                                    filterOptions,
                                                );
                                            }
                                        }}
                                    />
                                    <ToniqInput
                                        className="toniq-input-outline"
                                        placeholder="Max"
                                        value={
                                            currentFilters.mintNumber.max === undefined
                                                ? ''
                                                : currentFilters.mintNumber.max.toString()
                                        }
                                        onValueChange={event => {
                                            const values = Number(event.detail);
                                            if (!isNaN(values)) {
                                                var filterOptions = {
                                                    ...currentFilters,
                                                    mintNumber: {
                                                        ...currentFilters.mintNumber,
                                                        max: values,
                                                    },
                                                };
                                                setCurrentFilters(filterOptions);
                                                storeUserPreferences(
                                                    'filterOptions',
                                                    filterOptions,
                                                );
                                            }
                                        }}
                                    />
                                </div>
                            </div>
                        </Accordion>
                    </div>
                )}
            {(traitsData || collection?.route === 'cronics') && traitsCategories.length ? (
                <div>
                    <Accordion
                        title={`Traits (${traitsCategories.length})`}
                        open={openedAccordion.includes(filterTypes.traits)}
                        onOpenAccordionChange={() => {
                            toggleAccordion(filterTypes.traits);
                        }}
                    >
                        <div
                            className={classes.filterAccordionWrapper}
                            style={{marginLeft: 8, marginRight: 8}}
                        >
                            {collection?.route === 'cronics' ? (
                                <Grid container spacing={2}>
                                    {traitsCategories.map((traitsCategory, index) => {
                                        return (
                                            <Grid key={index} item xs={12}>
                                                <Accordion
                                                    title={uppercaseFirstLetterOfWord(
                                                        traitsCategory.category,
                                                    )}
                                                    open={openedAccordion.includes(
                                                        traitsCategory.category,
                                                    )}
                                                    onOpenAccordionChange={() => {
                                                        toggleAccordion(traitsCategory.category);
                                                    }}
                                                >
                                                    <div className={classes.cronicTraitsContainer}>
                                                        <Grid container spacing={2}>
                                                            <Grid item xs={12}>
                                                                <span>Dominant: </span>
                                                            </Grid>
                                                            <Grid item xs={12}>
                                                                <ToniqSlider
                                                                    min={
                                                                        filterRanges[
                                                                            currentFilters.traits
                                                                                .type
                                                                        ].min
                                                                    }
                                                                    max={
                                                                        filterRanges[
                                                                            currentFilters.traits
                                                                                .type
                                                                        ].max
                                                                    }
                                                                    double={true}
                                                                    value={
                                                                        currentFilters.traits
                                                                            .values[
                                                                            traitsCategory.category
                                                                        ].dominant ||
                                                                        filterRanges[
                                                                            currentFilters.traits
                                                                                .type
                                                                        ]
                                                                    }
                                                                    onValueChange={event => {
                                                                        const values = event.detail;
                                                                        var filterOptions = {
                                                                            ...currentFilters,
                                                                            traits: {
                                                                                ...currentFilters.traits,
                                                                                values: {
                                                                                    ...currentFilters
                                                                                        .traits
                                                                                        .values,
                                                                                    [traitsCategory.category]:
                                                                                        {
                                                                                            ...currentFilters
                                                                                                .traits
                                                                                                .values[
                                                                                                traitsCategory
                                                                                                    .category
                                                                                            ],
                                                                                            dominant:
                                                                                                values,
                                                                                        },
                                                                                },
                                                                            },
                                                                        };
                                                                        setCurrentFilters(
                                                                            filterOptions,
                                                                        );
                                                                        storeUserPreferences(
                                                                            'filterOptions',
                                                                            filterOptions,
                                                                        );
                                                                    }}
                                                                />
                                                            </Grid>
                                                        </Grid>
                                                        <Grid container spacing={2}>
                                                            <Grid item xs={12}>
                                                                <span>Recessive: </span>
                                                            </Grid>
                                                            <Grid item xs={12}>
                                                                <ToniqSlider
                                                                    min={
                                                                        filterRanges[
                                                                            currentFilters.traits
                                                                                .type
                                                                        ].min
                                                                    }
                                                                    max={
                                                                        filterRanges[
                                                                            currentFilters.traits
                                                                                .type
                                                                        ].max
                                                                    }
                                                                    double={true}
                                                                    value={
                                                                        currentFilters.traits
                                                                            .values[
                                                                            traitsCategory.category
                                                                        ].recessive ||
                                                                        filterRanges[
                                                                            currentFilters.traits
                                                                                .type
                                                                        ]
                                                                    }
                                                                    onValueChange={event => {
                                                                        const values = event.detail;
                                                                        var filterOptions = {
                                                                            ...currentFilters,
                                                                            traits: {
                                                                                ...currentFilters.traits,
                                                                                values: {
                                                                                    ...currentFilters
                                                                                        .traits
                                                                                        .values,
                                                                                    [traitsCategory.category]:
                                                                                        {
                                                                                            ...currentFilters
                                                                                                .traits
                                                                                                .values[
                                                                                                traitsCategory
                                                                                                    .category
                                                                                            ],
                                                                                            recessive:
                                                                                                values,
                                                                                        },
                                                                                },
                                                                            },
                                                                        };
                                                                        setCurrentFilters(
                                                                            filterOptions,
                                                                        );
                                                                        storeUserPreferences(
                                                                            'filterOptions',
                                                                            filterOptions,
                                                                        );
                                                                    }}
                                                                />
                                                            </Grid>
                                                        </Grid>
                                                    </div>
                                                </Accordion>
                                            </Grid>
                                        );
                                    })}
                                </Grid>
                            ) : (
                                <Grid container spacing={2}>
                                    {traitsCategories.map((traitsCategory, index) => {
                                        return (
                                            <Grid key={index} item xs={12}>
                                                <Accordion
                                                    title={
                                                        <div
                                                            style={{
                                                                display: 'flex',
                                                                justifyContent: 'space-between',
                                                                width: 'calc(100% - 32px)',
                                                            }}
                                                        >
                                                            <span>
                                                                {traitsCategory.category}{' '}
                                                                {traitsCategory.values.length &&
                                                                    `(${traitsCategory.values.length})`}
                                                            </span>
                                                            {openedAccordion.includes(
                                                                traitsCategory.category,
                                                            ) &&
                                                                findCurrentFilterTraitIndex(
                                                                    traitsCategory.category,
                                                                ) !== -1 && (
                                                                    <button
                                                                        className={
                                                                            classes.clearTraitFilter
                                                                        }
                                                                        onClick={event => {
                                                                            event.preventDefault();
                                                                            event.stopPropagation();
                                                                            const traitIndex =
                                                                                findCurrentFilterTraitIndex(
                                                                                    traitsCategory.category,
                                                                                );

                                                                            if (traitIndex !== -1) {
                                                                                currentFilters.traits.values.splice(
                                                                                    traitIndex,
                                                                                    1,
                                                                                );
                                                                            }

                                                                            var filterOptions = {
                                                                                ...currentFilters,
                                                                                traits: {
                                                                                    ...currentFilters.traits,
                                                                                    values: currentFilters
                                                                                        .traits
                                                                                        .values,
                                                                                },
                                                                            };
                                                                            setCurrentFilters(
                                                                                filterOptions,
                                                                            );
                                                                            storeUserPreferences(
                                                                                'filterOptions',
                                                                                filterOptions,
                                                                            );
                                                                        }}
                                                                    >
                                                                        Clear
                                                                    </button>
                                                                )}
                                                        </div>
                                                    }
                                                    open={openedAccordion.includes(
                                                        traitsCategory.category,
                                                    )}
                                                    onOpenAccordionChange={() => {
                                                        toggleAccordion(traitsCategory.category);
                                                    }}
                                                >
                                                    <div className={classes.traitsContainer}>
                                                        {traitsCategory.values &&
                                                        traitsCategory.values.length > 10 ? (
                                                            <ToniqInput
                                                                value={queryTrait}
                                                                style={{
                                                                    width: '100%',
                                                                    boxSizing: 'border-box',
                                                                }}
                                                                placeholder="Search..."
                                                                icon={Search24Icon}
                                                                onValueChange={event => {
                                                                    const searchTrait =
                                                                        event.detail;
                                                                    if (searchTrait) {
                                                                        setSearchParams({
                                                                            searchTrait,
                                                                        });
                                                                    } else {
                                                                        setSearchParams({});
                                                                    }
                                                                }}
                                                            />
                                                        ) : (
                                                            ''
                                                        )}
                                                        <div className={classes.traitsWrapper}>
                                                            {traitsCategory.values &&
                                                                queryFilteredTraits(
                                                                    traitsCategory.values,
                                                                ).map(trait => {
                                                                    return (
                                                                        <div
                                                                            key={`${trait}-${index}`}
                                                                            style={{
                                                                                display: 'flex',
                                                                                justifyContent:
                                                                                    'space-between',
                                                                            }}
                                                                        >
                                                                            <ToniqCheckbox
                                                                                checked={isTraitSelected(
                                                                                    trait,
                                                                                    traitsCategory.category,
                                                                                )}
                                                                                onCheckedChange={event => {
                                                                                    const traitIndex =
                                                                                        findCurrentFilterTraitIndex(
                                                                                            traitsCategory.category,
                                                                                        );

                                                                                    if (
                                                                                        event.detail
                                                                                    ) {
                                                                                        if (
                                                                                            traitIndex !==
                                                                                            -1
                                                                                        ) {
                                                                                            if (
                                                                                                !currentFilters.traits.values[
                                                                                                    traitIndex
                                                                                                ].values.includes(
                                                                                                    trait,
                                                                                                )
                                                                                            )
                                                                                                currentFilters.traits.values[
                                                                                                    traitIndex
                                                                                                ].values.push(
                                                                                                    trait,
                                                                                                );
                                                                                        } else {
                                                                                            currentFilters.traits.values.push(
                                                                                                {
                                                                                                    category:
                                                                                                        traitsCategory.category,
                                                                                                    values: [
                                                                                                        trait,
                                                                                                    ],
                                                                                                },
                                                                                            );
                                                                                        }
                                                                                    } else {
                                                                                        if (
                                                                                            traitIndex !==
                                                                                            -1
                                                                                        ) {
                                                                                            const valueIndex =
                                                                                                currentFilters.traits.values[
                                                                                                    traitIndex
                                                                                                ].values.findIndex(
                                                                                                    value => {
                                                                                                        return (
                                                                                                            value ===
                                                                                                            trait
                                                                                                        );
                                                                                                    },
                                                                                                );

                                                                                            if (
                                                                                                currentFilters
                                                                                                    .traits
                                                                                                    .values[
                                                                                                    traitIndex
                                                                                                ]
                                                                                                    .values
                                                                                                    .length !==
                                                                                                1
                                                                                            ) {
                                                                                                currentFilters.traits.values[
                                                                                                    traitIndex
                                                                                                ].values.splice(
                                                                                                    valueIndex,
                                                                                                    1,
                                                                                                );
                                                                                            } else {
                                                                                                currentFilters.traits.values.splice(
                                                                                                    traitIndex,
                                                                                                    1,
                                                                                                );
                                                                                            }
                                                                                        }
                                                                                    }
                                                                                    var filterOptions =
                                                                                        {
                                                                                            ...currentFilters,
                                                                                            traits: {
                                                                                                ...currentFilters.traits,
                                                                                                values: currentFilters
                                                                                                    .traits
                                                                                                    .values,
                                                                                            },
                                                                                        };
                                                                                    setCurrentFilters(
                                                                                        filterOptions,
                                                                                    );
                                                                                    storeUserPreferences(
                                                                                        'filterOptions',
                                                                                        filterOptions,
                                                                                    );
                                                                                }}
                                                                                style={{
                                                                                    width: '100%',
                                                                                }}
                                                                            >
                                                                                <div
                                                                                    style={{
                                                                                        display:
                                                                                            'flex',
                                                                                        placeContent:
                                                                                            'center space-between',
                                                                                        width: '100%',
                                                                                        gap: 4,
                                                                                    }}
                                                                                >
                                                                                    <span
                                                                                        style={{
                                                                                            textAlign:
                                                                                                'left',
                                                                                        }}
                                                                                    >
                                                                                        {trait}
                                                                                    </span>
                                                                                    <span
                                                                                        className={`${
                                                                                            isTraitSelected(
                                                                                                trait,
                                                                                                traitsCategory.category,
                                                                                            )
                                                                                                ? 'selected'
                                                                                                : ''
                                                                                        } ${
                                                                                            classes.traitCounter
                                                                                        }`}
                                                                                    >
                                                                                        {
                                                                                            traitsCategory
                                                                                                .count[
                                                                                                trait
                                                                                            ]
                                                                                        }
                                                                                    </span>
                                                                                </div>
                                                                            </ToniqCheckbox>
                                                                        </div>
                                                                    );
                                                                })}
                                                            {traitsCategory.values &&
                                                                !queryFilteredTraits(
                                                                    traitsCategory.values,
                                                                ).length && (
                                                                    <div
                                                                        style={{
                                                                            display: 'flex',
                                                                            justifyContent:
                                                                                'center',
                                                                            ...cssToReactStyleObject(
                                                                                toniqFontStyles.paragraphFont,
                                                                            ),
                                                                            opacity: 0.64,
                                                                        }}
                                                                    >
                                                                        <span>No Result</span>
                                                                    </div>
                                                                )}
                                                        </div>
                                                    </div>
                                                </Accordion>
                                            </Grid>
                                        );
                                    })}
                                </Grid>
                            )}
                        </div>
                    </Accordion>
                </div>
            ) : (
                ''
            )}
        </>
    );
}
