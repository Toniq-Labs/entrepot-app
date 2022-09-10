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
import {loadProfileNftsAndCollections, emptyAllUserNfts} from './ProfileLoadNfts';
import {ProfileTabs} from './ProfileTabs';

export function Profile(props) {
  const classes = profileStyles();
  const [allUserNfts, setAllUserNfts] = React.useState(emptyAllUserNfts);
  const [loading, setLoading] = React.useState(true);
  const [query, setQuery] = React.useState('');
  const [currentTab, setCurrentTab] = React.useState(ProfileTabs.MyNfts);

  console.log({allCollections: props.collections});
  const currentNftsAndCollections = allUserNfts[currentTab];

  async function refresh() {
    if (props.account && props.identity && props.collections) {
      const allResults = await loadProfileNftsAndCollections(
        props.account.address,
        props.identity,
        props.collections,
      );

      console.log({allResults});

      setAllUserNfts(allResults);
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
      text: allUserNfts[ProfileTabs.MyNfts].nfts.length,
    },
    {
      label: 'Collections',
      text: allUserNfts[ProfileTabs.MyNfts].collections.length,
    },
    {
      label: 'Floor Value',
      text: allUserNfts[ProfileTabs.MyNfts].stats.price.min,
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
          nftCount={currentNftsAndCollections.nfts.length}
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
        {loading ? (
          <div style={{display: 'flex', padding: '32px', gap: '16px'}}>
            <ToniqIcon icon={LoaderAnimated24Icon} />
            <span style={{...cssToReactStyleObject(toniqFontStyles.paragraphFont)}}>
              Loading...
            </span>
          </div>
        ) : (
          <ProfileBody
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
