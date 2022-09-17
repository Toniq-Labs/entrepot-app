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
import {startLoadingProfileNftsAndCollections, emptyAllUserNfts} from './ProfileLoadNfts';
import {ProfileTabs} from './ProfileTabs';
import {resolvedOrUndefined} from '../../utilities/async';

export function Profile(props) {
  const classes = profileStyles();

  // this is a ref, instead of state, so that we can always get the latest version, even in async
  // tasks that were started with outdated versioned of this variable. This saves us from race
  // conditions where the old state overrides the new state when async tasks finish.
  const allUserNfts = React.useRef(emptyAllUserNfts);
  // since the above is not a state object, we have to force updates with the following:
  const [, forceUpdate] = React.useReducer(x => x + 1, 0);

  const [loading, setLoading] = React.useState(true);
  const [query, setQuery] = React.useState('');
  const [currentTab, setCurrentTab] = React.useState(ProfileTabs.MyNfts);

  const currentNftsAndCollections = resolvedOrUndefined(allUserNfts.current[currentTab]);

  function refresh() {
    if (props.account && props.identity && props.collections) {
      const allResults = startLoadingProfileNftsAndCollections(
        props.account.address,
        props.identity,
        props.collections,
      );

      allUserNfts.current = allResults;

      Object.keys(allUserNfts.current).map(key =>
        allUserNfts.current[key].then(resolved => {
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
          onCurrentTabChange={newTab => {
            setCurrentTab(newTab);
          }}
          onQueryChange={newQuery => {
            setQuery(newQuery);
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
