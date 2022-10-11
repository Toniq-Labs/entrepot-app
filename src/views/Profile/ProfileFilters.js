import React from 'react';
import {
    ToniqToggleButton,
    ToniqSlider,
    ToniqIcon,
} from '@toniq-labs/design-system/dist/esm/elements/react-components';
import {
    toniqColors,
    ChevronDown24Icon,
    ChevronUp24Icon,
    cssToReactStyleObject,
    toniqFontStyles,
    X24Icon,
} from '@toniq-labs/design-system';
import {SelectableNameWithCount, makeCountIndicator} from '../../shared/SelectableNameWithCount';
import {nftStatusesByTab, NftStatusTitles} from './ProfileTabs';

const topLevelCollectionsExpandKey = 'top-collections';
const topLevelTraitsExpandKey = 'top-traits';
function collectionTraitsExpandKey(collectionId) {
    return `traits:${collectionId}`;
}
function collectionIndividualTraitExpandKey(collectionId, traitId) {
    return `traits:${collectionId}-trait:${traitId}`;
}

export function scaleRarity(input, factor, round) {
    const scaled = {
        min: input.min * factor,
        max: input.max * factor,
    };

    if (round) {
        return {
            min: Math.floor(scaled.min),
            max: Math.ceil(scaled.max),
        };
    } else {
        return scaled;
    }
}

export function ProfileFilters(props) {
    const [
        isSectionExpanded,
        setIsSectionExpanded,
    ] = React.useState({});

    function updateExpansion(key) {
        if (isSectionExpanded[key]) {
            setIsSectionExpanded({
                ...isSectionExpanded,
                [key]: false,
            });
        } else {
            setIsSectionExpanded({
                ...isSectionExpanded,
                [key]: true,
            });
        }
    }

    const areAnyTraitsSelected = Object.values(props.filters.traits ?? []).some(collectionTraits =>
        Object.values(collectionTraits ?? []).some(traits =>
            (Object.values(traits) ?? []).some(value => !!value),
        ),
    );

    return (
        <>
            <div>
                <div className="title">Status</div>
                {Object.values(nftStatusesByTab[props.currentTab]).map(filterStatus => {
                    return (
                        <ToniqToggleButton
                            key={filterStatus}
                            text={NftStatusTitles[filterStatus]}
                            toggled={props.filters.status == filterStatus}
                            onClick={() => {
                                props.updateFilters({
                                    ...props.filters,
                                    status: filterStatus,
                                });
                            }}
                        />
                    );
                })}
            </div>
            {props.nftFilterStats.price.min !== props.nftFilterStats.price.max && (
                <div>
                    <div className="title">Listing Price</div>
                    <ToniqSlider
                        min={props.nftFilterStats.price.min}
                        max={props.nftFilterStats.price.max}
                        suffix="ICP"
                        step="0.01"
                        double={true}
                        value={props.filters.price || props.nftFilterStats.price}
                        onValueChange={event => {
                            const values = event.detail;
                            props.updateFilters({
                                ...props.filters,
                                price: {
                                    ...values,
                                },
                            });
                        }}
                    />
                </div>
            )}
            {props.nftFilterStats.rarity.min !== props.nftFilterStats.rarity.max && (
                <div>
                    <div className="title">Rarity</div>
                    <ToniqSlider
                        min={scaleRarity(props.nftFilterStats.rarity, 100, true).min}
                        max={scaleRarity(props.nftFilterStats.rarity, 100, true).max}
                        suffix="%"
                        double={true}
                        value={scaleRarity(
                            props.filters.rarity || props.nftFilterStats.rarity,
                            100,
                            true,
                        )}
                        onValueChange={event => {
                            const values = event.detail;
                            props.updateFilters({
                                ...props.filters,
                                rarity: {
                                    ...scaleRarity(values, 0.01),
                                },
                            });
                        }}
                    />
                </div>
            )}
            {props.nftFilterStats.mintNumber.min !== props.nftFilterStats.mintNumber.max &&
                props.nftFilterStats.mintNumber.max > 1 && (
                    <div>
                        <div className="title">Mint #</div>
                        <ToniqSlider
                            min={props.nftFilterStats.mintNumber.min}
                            max={props.nftFilterStats.mintNumber.max}
                            double={true}
                            value={props.filters.mintNumber || props.nftFilterStats.mintNumber}
                            onValueChange={event => {
                                const values = event.detail;
                                props.updateFilters({
                                    ...props.filters,
                                    mintNumber: {
                                        ...values,
                                    },
                                });
                            }}
                        />
                    </div>
                )}
            {Object.keys(props.nftFilterStats.traits).length > 0 && (
                <div>
                    <div
                        className="title"
                        onClick={() => {
                            updateExpansion(topLevelTraitsExpandKey);
                        }}
                        style={{
                            marginBottom: '0',
                            display: 'flex',
                            cursor: 'pointer',
                            justifyContent: 'space-between',
                        }}
                    >
                        <span>Traits</span>
                        <ToniqIcon
                            icon={
                                isSectionExpanded[topLevelTraitsExpandKey]
                                    ? ChevronUp24Icon
                                    : ChevronDown24Icon
                            }
                        ></ToniqIcon>
                    </div>
                    <div
                        style={{
                            display: isSectionExpanded[topLevelTraitsExpandKey] ? 'block' : 'none',
                        }}
                    >
                        <div
                            style={{
                                visibility: areAnyTraitsSelected ? 'visible' : 'hidden',
                                display: 'flex',
                                alignItems: 'center',
                                gap: '4px',
                                marginTop: '4px',
                                paddingLeft: '8px',
                                cursor: 'pointer',
                            }}
                            onClick={() => {
                                props.updateFilters({
                                    ...props.filters,
                                    traits: {},
                                });
                            }}
                        >
                            Clear <ToniqIcon icon={X24Icon}></ToniqIcon>
                        </div>
                        <div>
                            {Object.keys(props.nftFilterStats.traits)
                                .sort((a, b) =>
                                    props.nftFilterStats.traits[a].collection.name.localeCompare(
                                        props.nftFilterStats.traits[b].collection.name,
                                    ),
                                )
                                .map(collectionId => {
                                    const collection =
                                        props.nftFilterStats.traits[collectionId].collection;
                                    const traits =
                                        props.nftFilterStats.traits[collectionId].traitsInUse;
                                    const collectionExpandKey = collectionTraitsExpandKey(
                                        collection.id,
                                    );
                                    const isCollectionSelected = Object.values(
                                        props.filters.traits[collectionId] ?? [],
                                    ).some(traits =>
                                        (Object.values(traits) ?? []).some(value => !!value),
                                    );

                                    return (
                                        <div key={collection.name}>
                                            <SelectableNameWithCount
                                                title={collection.name}
                                                imageUrl={
                                                    collection.avatar ||
                                                    (collection.hasOwnProperty('collection') &&
                                                    collection.collection
                                                        ? collection.collection
                                                        : '/collections/' +
                                                          collection.canister +
                                                          '.jpg')
                                                }
                                                selected={isCollectionSelected}
                                                onClick={() => {
                                                    updateExpansion(collectionExpandKey);
                                                }}
                                            >
                                                <ToniqIcon
                                                    style={{marginLeft: '4px'}}
                                                    icon={
                                                        isSectionExpanded[collectionExpandKey]
                                                            ? ChevronUp24Icon
                                                            : ChevronDown24Icon
                                                    }
                                                ></ToniqIcon>
                                            </SelectableNameWithCount>
                                            <div
                                                style={{
                                                    display: isSectionExpanded[collectionExpandKey]
                                                        ? 'block'
                                                        : 'none',
                                                }}
                                            >
                                                {Object.keys(traits).map(traitId => {
                                                    const traitExpandKey =
                                                        collectionIndividualTraitExpandKey(
                                                            collectionId,
                                                            traitId,
                                                        );
                                                    const traitName =
                                                        collection.traits[0][traitId][1];

                                                    const isTraitSelected = Object.values(
                                                        props.filters.traits[collectionId]?.[
                                                            traitId
                                                        ] ?? [],
                                                    ).some(value => !!value);

                                                    return (
                                                        <div key={traitExpandKey}>
                                                            <div
                                                                style={{
                                                                    padding: '8px 16px',
                                                                    display: 'flex',
                                                                    justifyContent: 'space-between',
                                                                    cursor: 'pointer',
                                                                }}
                                                                onClick={() => {
                                                                    updateExpansion(traitExpandKey);
                                                                }}
                                                            >
                                                                <span
                                                                    style={{
                                                                        ...(isTraitSelected
                                                                            ? cssToReactStyleObject(
                                                                                  toniqFontStyles.boldParagraphFont,
                                                                              )
                                                                            : cssToReactStyleObject(
                                                                                  toniqFontStyles.paragraphFont,
                                                                              )),
                                                                    }}
                                                                >
                                                                    {traitName}
                                                                </span>
                                                                <div
                                                                    style={{
                                                                        display: 'flex',
                                                                        gap: '4px',
                                                                    }}
                                                                >
                                                                    <ToniqIcon
                                                                        icon={
                                                                            isSectionExpanded[
                                                                                traitExpandKey
                                                                            ]
                                                                                ? ChevronUp24Icon
                                                                                : ChevronDown24Icon
                                                                        }
                                                                    ></ToniqIcon>
                                                                </div>
                                                            </div>
                                                            <div
                                                                style={{
                                                                    display: isSectionExpanded[
                                                                        traitExpandKey
                                                                    ]
                                                                        ? 'block'
                                                                        : 'none',
                                                                }}
                                                            >
                                                                {Object.keys(traits[traitId]).map(
                                                                    traitStyleId => {
                                                                        const traitStyleName =
                                                                            collection.traits[0][
                                                                                traitId
                                                                            ][2][traitStyleId][1];

                                                                        const isTraitTypeSelected =
                                                                            props.filters.traits[
                                                                                collectionId
                                                                            ]?.[traitId]?.[
                                                                                traitStyleId
                                                                            ];
                                                                        return (
                                                                            <div
                                                                                style={{
                                                                                    ...(isTraitTypeSelected
                                                                                        ? cssToReactStyleObject(
                                                                                              toniqFontStyles.boldLabelFont,
                                                                                          )
                                                                                        : cssToReactStyleObject(
                                                                                              toniqFontStyles.labelFont,
                                                                                          )),
                                                                                    padding:
                                                                                        '4px 32px',
                                                                                    display: 'flex',
                                                                                    justifyContent:
                                                                                        'space-between',
                                                                                    cursor: 'pointer',
                                                                                    alignItems:
                                                                                        'center',
                                                                                }}
                                                                                key={traitStyleName}
                                                                                onClick={() => {
                                                                                    props.updateFilters(
                                                                                        {
                                                                                            ...props.filters,
                                                                                            traits: {
                                                                                                ...props
                                                                                                    .filters
                                                                                                    .traits,
                                                                                                [collectionId]:
                                                                                                    {
                                                                                                        ...props
                                                                                                            .filters
                                                                                                            .traits[
                                                                                                            collectionId
                                                                                                        ],
                                                                                                        [traitId]:
                                                                                                            {
                                                                                                                ...props
                                                                                                                    .filters
                                                                                                                    .traits[
                                                                                                                    collectionId
                                                                                                                ]?.[
                                                                                                                    traitId
                                                                                                                ],
                                                                                                                [traitStyleId]:
                                                                                                                    !isTraitTypeSelected,
                                                                                                            },
                                                                                                    },
                                                                                            },
                                                                                        },
                                                                                    );
                                                                                }}
                                                                            >
                                                                                <span>
                                                                                    {traitStyleName}
                                                                                </span>
                                                                                {makeCountIndicator(
                                                                                    traits[traitId][
                                                                                        traitStyleId
                                                                                    ],
                                                                                    isTraitTypeSelected,
                                                                                )}
                                                                            </div>
                                                                        );
                                                                    },
                                                                )}
                                                            </div>
                                                        </div>
                                                    );
                                                })}
                                            </div>
                                        </div>
                                    );
                                })}
                        </div>
                    </div>
                </div>
            )}
            {props.userCollections.length > 1 && (
                <div>
                    <div
                        className="title"
                        onClick={() => {
                            updateExpansion(topLevelCollectionsExpandKey);
                        }}
                        style={{
                            display: 'flex',
                            cursor: 'pointer',
                            justifyContent: 'space-between',
                        }}
                    >
                        <span>Collections ({props.userCollections.length})</span>
                        <ToniqIcon
                            icon={
                                isSectionExpanded[topLevelCollectionsExpandKey]
                                    ? ChevronUp24Icon
                                    : ChevronDown24Icon
                            }
                        ></ToniqIcon>
                    </div>
                    <div
                        style={{
                            display: isSectionExpanded[topLevelCollectionsExpandKey]
                                ? 'block'
                                : 'none',
                        }}
                    >
                        <div
                            style={{
                                borderBottom: `1px solid ${String(
                                    toniqColors.divider.foregroundColor,
                                )}`,
                                paddingBottom: '24px',
                            }}
                        >
                            <SelectableNameWithCount
                                title="All Collections"
                                selected={props.filters.allCollections}
                                count={props.userNfts.length}
                                onClick={() => {
                                    props.updateFilters({
                                        ...props.filters,
                                        allCollections: true,
                                        collections: [],
                                    });
                                }}
                            />
                        </div>
                        <div style={{paddingTop: '32px'}}>
                            {props.userCollections
                                .sort((a, b) => a.name.localeCompare(b.name))
                                .map(collection => {
                                    return (
                                        <SelectableNameWithCount
                                            key={collection.name}
                                            title={collection.name}
                                            imageUrl={
                                                collection.avatar ||
                                                (collection.hasOwnProperty('collection') &&
                                                collection.collection
                                                    ? collection.collection
                                                    : '/collections/' +
                                                      collection.canister +
                                                      '.jpg')
                                            }
                                            selected={props.filters.collections.includes(
                                                collection.name,
                                            )}
                                            count={
                                                props.nftFilterStats.collections[collection.name]
                                            }
                                            onClick={() => {
                                                const isAlreadyIncluded =
                                                    props.filters.collections.includes(
                                                        collection.name,
                                                    );

                                                const newCollections = isAlreadyIncluded
                                                    ? props.filters.collections.filter(
                                                          collectionName => {
                                                              return (
                                                                  collectionName !== collection.name
                                                              );
                                                          },
                                                      )
                                                    : props.filters.collections.concat(
                                                          collection.name,
                                                      );

                                                props.updateFilters({
                                                    ...props.filters,
                                                    allCollections: !newCollections.length,
                                                    collections: newCollections,
                                                });
                                            }}
                                        />
                                    );
                                })}
                        </div>
                    </div>
                </div>
            )}
        </>
    );
}
