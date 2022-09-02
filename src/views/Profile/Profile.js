/* global BigInt */
import React from 'react';
import {
  cssToReactStyleObject,
  toniqFontStyles,
  Icp16Icon,
  LoaderAnimated24Icon,
} from '@toniq-labs/design-system';
import extjs from '../../ic/extjs.js';
import {loadAllUserTokens, getEXTCanister, getEXTID} from '../../utilities/load-tokens';
import {useInterval} from '../../utilities/use-interval';
import {EntrepotNFTImage, EntrepotNFTMintNumber} from '../../utils';
import {profileStyles} from './ProfileStyles';
import {ProfileHeader} from './ProfileHeader';
import {ProfileBody} from './ProfileBody';
import getNri from '../../ic/nftv.js';
import {ToniqIcon} from '@toniq-labs/design-system/dist/esm/elements/react-components';
import {
  loadProfileNftsAndCollections,
  blankNftFilterStats,
  createNftFilterStats,
} from './ProfileUtils';

const ProfileTabs = {
  MyNfts: 'My NFTs',
  Watching: 'Watching',
  Activity: 'Activity',
};

export function Profile(props) {
  const classes = profileStyles();
  const [userCollections, setUserCollections] = React.useState([]);
  const [loading, setLoading] = React.useState(true);
  const [userNfts, setUserNfts] = React.useState([]);
  const [query, setQuery] = React.useState('');
  const [currentTab, setCurrentTab] = React.useState(ProfileTabs.MyNfts);
  const [nftFilterStats, setNftFilterStats] = React.useState(blankNftFilterStats);

  async function refresh() {
    if (props.account && props.identity && props.collections) {
      const {userNfts, userCollections} = await loadProfileNftsAndCollections(
        props.account.address,
        props.identity,
        props.collections,
      );

      console.log({userNfts, userCollections});
      setUserNfts(userNfts);
      setUserCollections(userCollections);

      const filterStats = createNftFilterStats(userNfts);

      console.log({filterStats});
      setNftFilterStats(filterStats);
      setLoading(false);
    }
  }

  React.useEffect(() => {
    refresh();
  }, [props.account, props.identity, props.collections]);

  useInterval(refresh, 10 * 60 * 1000);

  const profileDetails = [
    {
      label: 'Total NFTs',
      text: userNfts.length,
    },
    {
      label: 'Collections',
      text: userCollections.length,
    },
    {
      label: 'Floor Value',
      text: -1,
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
          nftCount={userNfts.length}
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
            onSellClick={props.onSellClick}
            onTransferClick={props.onTransferClick}
            style={{flexGrow: 1, maxWidth: '100%'}}
            nftFilterStats={nftFilterStats}
            userNfts={userNfts}
            userCollections={userCollections}
          />
        )}
      </div>
    </>
  );
}
