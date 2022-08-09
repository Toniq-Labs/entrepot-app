import React from 'react';
import {makeStyles, useTheme} from '@material-ui/core/styles';
import {useSearchParams} from 'react-router-dom';
import {useNavigate} from 'react-router';
import {Link} from 'react-router-dom';
import MenuItem from '@material-ui/core/MenuItem';
import Grid from '@material-ui/core/Grid';
import InputLabel from '@material-ui/core/InputLabel';
import FormControl from '@material-ui/core/FormControl';
import Select from '@material-ui/core/Select';
import TextField from '@material-ui/core/TextField';
import PriceICP from '../components/PriceICP';
import {EntrepotUpdateStats, EntrepotAllStats} from '../utils';
import {isToniqEarnCollection} from '../location/toniq-earn-collections';
import {
  cssToReactStyleObject,
  toniqFontStyles,
  toniqColors,
  LoaderAnimated24Icon,
  Icp16Icon,
} from '@toniq-labs/design-system';
import {NftCard} from '../components/shared/NftCard';
import {
  ToniqIcon,
  ToniqChip,
  ToniqToggleButton,
} from '@toniq-labs/design-system/dist/esm/elements/react-components';
import {icpToString} from '../components/PriceICP';
import {truncateNumber} from '../truncation';

function useInterval(callback, delay) {
  const savedCallback = React.useRef();

  // Remember the latest callback.
  React.useEffect(() => {
    savedCallback.current = callback;
  }, [callback]);

  // Set up the interval.
  React.useEffect(() => {
    function tick() {
      savedCallback.current();
    }
    if (delay !== null) {
      let id = setInterval(tick, delay);
      return () => clearInterval(id);
    }
  }, [delay]);
}
const useStyles = makeStyles(theme => ({
  breakpoints: {
    values: {
      xs: 0,
      sm: 600,
      md: 960,
      lg: 1280,
      xl: 1920,
    },
  },
  collectionContainer: {
    marginBottom: 20,
    maxWidth: '100%',
  },
  root: {
    maxWidth: 345,
  },
  heading: {
    textAlign: 'center',
  },
  media: {
    cursor: 'pointer',
    height: 0,
    paddingTop: '56.25%', // 16:9
  },
  collectionCard: {
    display: 'flex',
    flexDirection: 'column',
    minHeight: 480,
    '@media (max-width: 400px)': {
      height: 'unset',
    },
  },
  collectionCardBottomHalf: {
    display: 'flex',
    flexDirection: 'column',
    flexGrow: 1,
    alignItems: 'stretch',
  },
  collectionCardCollectionName: {
    textOverflow: 'ellipsis',
    overflow: 'hidden',
    alignSelf: 'stretch',
    ...cssToReactStyleObject(toniqFontStyles.h3Font),
    marginBottom: 0,
    marginTop: '16px',
    display: '-webkit-box',
    '-webkit-line-clamp': 2,
    '-webkit-box-orient': 'vertical',
    overflow: 'hidden',
  },
  collectionCardBrief: {
    margin: 0,
    display: '-webkit-box',
    '-webkit-line-clamp': 3,
    '-webkit-box-orient': 'vertical',
    overflow: 'hidden',
    textOverflow: 'clip',
    padding: '4px 0',
    ...cssToReactStyleObject(toniqFontStyles.paragraphFont),
    color: String(toniqColors.pageSecondary.foregroundColor),
  },
  collectionCardBriefWrapper: {
    display: 'flex',
    flexDirection: 'column',
    flexBasis: 0,
    flexGrow: 1,
    minHeight: '54px',
    justifyContent: 'center',
    flexDirection: 'column',
    alignSelf: 'stretch',
  },
  collectionDetailsWrapper: {
    display: 'flex',
    flexWrap: 'wrap',
    flexShrink: 1,
    justifyContent: 'center',
    gap: '16px',
  },
  collectionDetailsCell: {
    display: 'flex',
    flexDirection: 'column',
    gap: '8px',
    alignItems: 'stretch',
    textAlign: 'center',
    flexBasis: '0',
    minWidth: '80px',
    flexGrow: 1,
  },
  collectionDetailsChip: {
    ...cssToReactStyleObject(toniqFontStyles.boldFont),
    ...cssToReactStyleObject(toniqFontStyles.monospaceFont),
    fontSize: '15px',
  },
}));

export default function Marketplace(props) {
  const navigate = useNavigate();
  const classes = useStyles();
  const [sort, setSort] = React.useState('total_desc');
  const [searchParams, setSearchParams] = useSearchParams();

  const query = searchParams.get('search') || '';
  const [stats, setStats] = React.useState([]);

  const _updates = () => {
    EntrepotUpdateStats().then(setStats);
  };
  const changeSort = event => {
    setSort(event.target.value);
  };
  React.useEffect(() => {
    if (EntrepotAllStats().length == 0) {
      _updates();
    } else {
      setStats(EntrepotAllStats());
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  useInterval(_updates, 60 * 1000);
  const handleClick = a => {
    navigate(a);
  };
  return (
    <>
      <div style={{width: '100%', display: 'block', position: 'relative'}}>
        <div
          style={{
            margin: '0px auto',
            minHeight: 'calc(100vh - 221px)',
          }}
        >
          <h1 className={classes.heading}>All Collections</h1>
          <div style={{margin: '0 auto', textAlign: 'center', maxWidth: 500}}>
            <TextField
              placeholder="Search"
              style={{width: '100%', marginBottom: 50}}
              value={query}
              onChange={e => setSearchParams(e.target.value ? {search: e.target.value} : {})}
              variant="outlined"
            />
          </div>
          <div style={{textAlign: 'right', marginBottom: '30px', marginRight: 25}}>
            <FormControl style={{marginRight: 20}}>
              <InputLabel>Sort by</InputLabel>
              <Select value={sort} onChange={changeSort}>
                <MenuItem value={'listings_asc'}>Listings: Low to High</MenuItem>
                <MenuItem value={'listings_desc'}>Listings: High to Low</MenuItem>
                <MenuItem value={'total_asc'}>Total Volume: Low to High</MenuItem>
                <MenuItem value={'total_desc'}>Total Volume: High to Low</MenuItem>
                <MenuItem value={'floor_asc'}>Floor Price: Low to High</MenuItem>
                <MenuItem value={'floor_desc'}>Floor Price: High to Low</MenuItem>
                <MenuItem value={'alpha_asc'}>Alphabetically: A-Z</MenuItem>
                <MenuItem value={'alpha_desc'}>Alphabetically: Z-A</MenuItem>
              </Select>
            </FormControl>
          </div>
          <Grid container direction="row" justifyContent="center" alignItems="start" spacing={4}>
            {props.collections
              .filter(collection => {
                // prevent Toniq Earn related collections from showing up in countries where its blocked
                const allowed = isToniqEarnCollection(collection) ? props.isToniqEarnAllowed : true;
                const inQuery =
                  [collection.name, collection.brief, collection.keywords]
                    .join(' ')
                    .toLowerCase()
                    .indexOf(query.toLowerCase()) >= 0;
                return allowed && (query == '' || inQuery);
              })
              .sort((a, b) => {
                switch (sort) {
                  case 'featured':
                    return b.priority - a.priority;
                    break;
                  case 'listings_asc':
                    if (
                      stats.findIndex(x => x.canister == a.canister) < 0 &&
                      stats.findIndex(x => x.canister == b.canister) < 0
                    )
                      return 0;
                    if (stats.findIndex(x => x.canister == a.canister) < 0) return 1;
                    if (stats.findIndex(x => x.canister == b.canister) < 0) return -1;
                    if (
                      stats.find(x => x.canister == a.canister).stats === false &&
                      stats.find(x => x.canister == b.canister).stats === false
                    )
                      return 0;
                    if (stats.find(x => x.canister == a.canister).stats === false) return 1;
                    if (stats.find(x => x.canister == b.canister).stats === false) return -1;
                    return (
                      Number(stats.find(x => x.canister == a.canister).stats.listings) -
                      Number(stats.find(x => x.canister == b.canister).stats.listings)
                    );
                    break;
                  case 'listings_desc':
                    if (
                      stats.findIndex(x => x.canister == a.canister) < 0 &&
                      stats.findIndex(x => x.canister == b.canister) < 0
                    )
                      return 0;
                    if (stats.findIndex(x => x.canister == a.canister) < 0) return 1;
                    if (stats.findIndex(x => x.canister == b.canister) < 0) return -1;
                    if (
                      stats.find(x => x.canister == a.canister).stats === false &&
                      stats.find(x => x.canister == b.canister).stats === false
                    )
                      return 0;
                    if (stats.find(x => x.canister == a.canister).stats === false) return 1;
                    if (stats.find(x => x.canister == b.canister).stats === false) return -1;
                    return (
                      Number(stats.find(x => x.canister == b.canister).stats.listings) -
                      Number(stats.find(x => x.canister == a.canister).stats.listings)
                    );
                    break;
                  case 'total_asc':
                    if (
                      stats.findIndex(x => x.canister == a.canister) < 0 &&
                      stats.findIndex(x => x.canister == b.canister) < 0
                    )
                      return 0;
                    if (stats.findIndex(x => x.canister == a.canister) < 0) return 1;
                    if (stats.findIndex(x => x.canister == b.canister) < 0) return -1;
                    if (
                      stats.find(x => x.canister == a.canister).stats === false &&
                      stats.find(x => x.canister == b.canister).stats === false
                    )
                      return 0;
                    if (stats.find(x => x.canister == a.canister).stats === false) return 1;
                    if (stats.find(x => x.canister == b.canister).stats === false) return -1;
                    return (
                      Number(stats.find(x => x.canister == a.canister).stats.total) -
                      Number(stats.find(x => x.canister == b.canister).stats.total)
                    );
                    break;
                  case 'total_desc':
                    if (
                      stats.findIndex(x => x.canister == a.canister) < 0 &&
                      stats.findIndex(x => x.canister == b.canister) < 0
                    )
                      return 0;
                    if (stats.findIndex(x => x.canister == a.canister) < 0) return 1;
                    if (stats.findIndex(x => x.canister == b.canister) < 0) return -1;
                    if (
                      stats.find(x => x.canister == a.canister).stats === false &&
                      stats.find(x => x.canister == b.canister).stats === false
                    )
                      return 0;
                    if (stats.find(x => x.canister == a.canister).stats === false) return 1;
                    if (stats.find(x => x.canister == b.canister).stats === false) return -1;
                    return (
                      Number(stats.find(x => x.canister == b.canister).stats.total) -
                      Number(stats.find(x => x.canister == a.canister).stats.total)
                    );
                    break;
                  case 'floor_asc':
                    if (
                      stats.findIndex(x => x.canister == a.canister) < 0 &&
                      stats.findIndex(x => x.canister == b.canister) < 0
                    )
                      return 0;
                    if (stats.findIndex(x => x.canister == a.canister) < 0) return 1;
                    if (stats.findIndex(x => x.canister == b.canister) < 0) return -1;
                    if (
                      stats.find(x => x.canister == a.canister).stats === false &&
                      stats.find(x => x.canister == b.canister).stats === false
                    )
                      return 0;
                    if (stats.find(x => x.canister == a.canister).stats === false) return 1;
                    if (stats.find(x => x.canister == b.canister).stats === false) return -1;
                    return (
                      Number(stats.find(x => x.canister == a.canister).stats.floor) -
                      Number(stats.find(x => x.canister == b.canister).stats.floor)
                    );
                    break;
                  case 'floor_desc':
                    if (
                      stats.findIndex(x => x.canister == a.canister) < 0 &&
                      stats.findIndex(x => x.canister == b.canister) < 0
                    )
                      return 0;
                    if (stats.findIndex(x => x.canister == a.canister) < 0) return 1;
                    if (stats.findIndex(x => x.canister == b.canister) < 0) return -1;
                    if (
                      stats.find(x => x.canister == a.canister).stats === false &&
                      stats.find(x => x.canister == b.canister).stats === false
                    )
                      return 0;
                    if (stats.find(x => x.canister == a.canister).stats === false) return 1;
                    if (stats.find(x => x.canister == b.canister).stats === false) return -1;
                    return (
                      Number(stats.find(x => x.canister == b.canister).stats.floor) -
                      Number(stats.find(x => x.canister == a.canister).stats.floor)
                    );
                    break;
                  case 'alpha_asc':
                    if (a.name < b.name) {
                      return -1;
                    }
                    if (a.name > b.name) {
                      return 1;
                    }
                    return 0;
                    break;
                  case 'alpha_desc':
                    if (a.name < b.name) {
                      return 1;
                    }
                    if (a.name > b.name) {
                      return -1;
                    }
                    return 0;
                    break;
                  default:
                    return 0;
                }
              })
              .map((collection, i) => {
                return (
                  <Grid key={i} item className={classes.collectionContainer}>
                    <Link
                      className={classes.collectionCard}
                      style={{textDecoration: 'none'}}
                      to={'/marketplace/' + collection.route}
                    >
                      <NftCard
                        style={{flexGrow: 1}}
                        title={collection.name}
                        imageUrl={
                          collection.hasOwnProperty('collection') && collection.collection
                            ? collection.collection
                            : '/collections/' + collection.canister + '.jpg'
                        }
                      >
                        <div className={classes.collectionCardBottomHalf}>
                          <h2 className={classes.collectionCardCollectionName}>
                            {collection.name}
                          </h2>
                          {collection.brief ? (
                            <div className={classes.collectionCardBriefWrapper}>
                              <p className={classes.collectionCardBrief}>{collection.brief}</p>
                            </div>
                          ) : (
                            ''
                          )}
                          {(() => {
                            const collectionStatsWrapper = stats.find(
                              stat => stat.canister === collection.canister,
                            );

                            if (collectionStatsWrapper) {
                              if (collectionStatsWrapper.stats) {
                                const collectionStatDetails = [
                                  {
                                    label: 'Volume',
                                    icon: Icp16Icon,
                                    value: icpToString(
                                      collectionStatsWrapper.stats.total,
                                      false,
                                      true,
                                    ),
                                  },
                                  {
                                    label: 'Listings',
                                    icon: undefined,
                                    value: truncateNumber(collectionStatsWrapper.stats.listings),
                                  },
                                  {
                                    label: 'Floor Price',
                                    icon: Icp16Icon,
                                    value: icpToString(
                                      collectionStatsWrapper.stats.floor,
                                      false,
                                      true,
                                    ),
                                  },
                                ];

                                return (
                                  <div className={classes.collectionDetailsWrapper}>
                                    {collectionStatDetails.map((cellDetails, _index, fullArray) => (
                                      <div
                                        key={cellDetails.label}
                                        style={{
                                          maxWidth: `${100 / fullArray.length}%`,
                                        }}
                                        className={classes.collectionDetailsCell}
                                      >
                                        <span
                                          style={{
                                            textTransform: 'uppercase',
                                            ...cssToReactStyleObject(toniqFontStyles.labelFont),
                                          }}
                                        >
                                          {cellDetails.label}
                                        </span>
                                        <ToniqChip
                                          className={`toniq-chip-secondary ${classes.collectionDetailsChip}`}
                                          icon={cellDetails.icon}
                                          text={cellDetails.value}
                                        ></ToniqChip>
                                      </div>
                                    ))}
                                  </div>
                                );
                              } else {
                                return '';
                              }
                            } else {
                              return (
                                <ToniqIcon
                                  style={{
                                    color: String(toniqColors.pagePrimary.foregroundColor),
                                    alignSelf: 'center',
                                  }}
                                  icon={LoaderAnimated24Icon}
                                />
                              );
                            }
                          })()}
                        </div>
                      </NftCard>
                    </Link>
                  </Grid>
                );
              })}
          </Grid>
        </div>
      </div>
    </>
  );
}
