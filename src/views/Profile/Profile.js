/* global BigInt */
import React from 'react';
import {
  cssToReactStyleObject,
  toniqFontStyles,
  Icp16Icon,
  LoaderAnimated24Icon,
} from '@toniq-labs/design-system';
import {useInterval} from '../../utilities/use-interval';
import {profileStyles} from './ProfileStyles';
import {ProfileHeader} from './ProfileHeader';
import {ProfileBody} from './ProfileBody';
import {ToniqIcon} from '@toniq-labs/design-system/dist/esm/elements/react-components';
import {startLoadingProfileNftsAndCollections} from './ProfileLoadNfts';
import {ProfileTabs, ProfileViewType} from './ProfileTabs';
import {resolvedOrUndefined} from '../../utilities/async';
import {useParams, useNavigate, useSearchParams, createSearchParams} from 'react-router-dom';
import {spreadableSearchParams} from '../../utilities/search-params';

const profileSearchParamName = 'profile-search';

export function Profile(props) {
  const classes = profileStyles();
  const navigate = useNavigate();
  const {tab: currentTab, address} = useParams();
  const [searchParams, setSearchParams] = useSearchParams();

  const query = searchParams.get(profileSearchParamName) || '';

  // this is a ref, instead of state, so that we can always get the latest version, even in async
  // tasks that were started with outdated versioned of this variable. This saves us from race
  // conditions where the old state overrides the new state when async tasks finish.
  const allUserNfts = React.useRef({});
  // since the above is not a state object, we have to force updates with the following:
  const [, forceUpdate] = React.useReducer(x => x + 1, 0);

  const [loading, setLoading] = React.useState(true);

  const viewType = searchParams.get('view');

  if (!Object.values(ProfileViewType).includes(viewType)) {
    setSearchParams({...spreadableSearchParams(searchParams), view: ProfileViewType.Grid});
  }

  const currentNftsAndCollections = resolvedOrUndefined(allUserNfts.current[currentTab]);

  if (!address || (address === 'undefined' && props.account)) {
    navigate({
      pathname: `/${props.account.address}/profile/${currentTab}`,
      search: `?${createSearchParams(searchParams)}`,
    });
  }

  function refresh() {
    if (props.account && props.identity && props.collections) {
      const allResults = startLoadingProfileNftsAndCollections(
        props.account.address,
        props.identity,
        props.collections,
      );

      /**
       * Only set promises if it hasn't been loaded already, this prevents future refreshes from
       * wiping the screen and showing a loading screen.
       */
      if (!Object.keys(allUserNfts.current).length) {
        allUserNfts.current = allResults;
      }

      Object.keys(allResults).map(key =>
        allResults[key].then(resolved => {
          allUserNfts.current[key] = resolved;
          forceUpdate();
          if (Object.values(allUserNfts).every(value => !(value instanceof Promise))) {
            console.info({allLoadedProfileNfts: allUserNfts});
          }
        }),
      );

      setLoading(false);
    }
  }

  React.useEffect(() => {
    refresh();
  }, [props.account, props.identity, props.collections]);

  useInterval(refresh, 10 * 60 * 1000);

  const profileDetails = [
    {
      label: 'Owned NFTs',
      text: resolvedOrUndefined(allUserNfts.current[ProfileTabs.MyNfts])?.nfts.length ?? 0,
    },
    {
      label: 'Collections',
      text: resolvedOrUndefined(allUserNfts.current[ProfileTabs.MyNfts])?.collections.length ?? 0,
    },
    {
      label: 'Floor Value',
      text: resolvedOrUndefined(allUserNfts.current[ProfileTabs.MyNfts])?.stats.price.min ?? 0,
      icon: Icp16Icon,
    },
  ];

  return (
    <>
      <div
        style={{
          width: '100%',
          display: 'flex',
          flexDirection: 'column',
          position: 'relative',
          margin: '0px auto',
          minHeight: 'calc(100vh - 221px)',
          ...cssToReactStyleObject(toniqFontStyles.toniqFont),
        }}
      >
        <ProfileHeader
          nftCount={currentNftsAndCollections?.nfts.length ?? 0}
          profileDetails={profileDetails}
          classes={classes}
          query={query}
          tabs={ProfileTabs}
          currentTab={currentTab}
          viewType={viewType}
          onViewTypeChange={newViewType => {
            setSearchParams({...spreadableSearchParams(searchParams), view: newViewType});
          }}
          onCurrentTabChange={newTab => {
            if (props.account.address) {
              navigate({
                pathname: `/${props.account.address}/profile/${newTab}`,
                search: `?${createSearchParams(searchParams)}`,
              });
            }
          }}
          onQueryChange={newQuery => {
            const newSearch = createSearchParams(
              newQuery ? {[profileSearchParamName]: newQuery} : {},
            );
            setSearchParams(newSearch);
          }}
        />
        {loading || !currentNftsAndCollections ? (
          <div style={{display: 'flex', padding: '32px', gap: '16px'}}>
            <ToniqIcon icon={LoaderAnimated24Icon} />
            <span style={{...cssToReactStyleObject(toniqFontStyles.paragraphFont)}}>
              Loading...
            </span>
          </div>
        ) : (
          <ProfileBody
            query={query}
            viewType={viewType}
            address={props.account.address}
            currentTab={currentTab}
            onSellClick={props.onSellClick}
            onTransferClick={props.onTransferClick}
            style={{flexGrow: 1, maxWidth: '100%'}}
            nftFilterStats={currentNftsAndCollections.stats}
            userNfts={currentNftsAndCollections.nfts}
            userCollections={currentNftsAndCollections.collections}
          />
        )}
      </div>
    </>
  );
}