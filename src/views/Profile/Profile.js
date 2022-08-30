/* global BigInt */
import React from 'react';
import {cssToReactStyleObject, toniqFontStyles, Icp16Icon} from '@toniq-labs/design-system';
import extjs from '../../ic/extjs.js';
import {loadAllUserTokens, getEXTCanister} from '../../utilities/load-tokens';
import {useInterval} from '../../utilities/use-interval';
import {EntrepotNFTImage} from '../../utils';
import {profileStyles} from './ProfileStyles';
import {ProfileHeader} from './ProfileHeader';
import {ProfileBody} from './ProfileBody';

const ProfileTabs = {
  MyNfts: 'My NFTs',
  Watching: 'Watching',
  Activity: 'Activity',
};

export function Profile(props) {
  const classes = profileStyles();
  const [userCollections, setUserCollections] = React.useState([]);
  const [userNfts, setUserNfts] = React.useState([]);
  const [query, setQuery] = React.useState('');
  const [currentTab, setCurrentTab] = React.useState(ProfileTabs.MyNfts);

  async function refresh() {
    const address = props.account.address;
    const allUserNfts = (
      await Promise.all([loadAllUserTokens(address, props.identity.getPrincipal().toText())])
    ).flat();

    const allUserNftCanisterIds = new Set(allUserNfts.map(userNft => userNft.canister));

    const userCollections = props.collections.filter(collection => {
      const isAllowedToView = !collection.dev;

      return isAllowedToView && allUserNftCanisterIds.has(collection.canister);
    });

    const userCollectionCanisterIds = new Set(
      userCollections.map(collection => collection.canister),
    );

    const rawAllowedUserNfts = allUserNfts.filter(nft => {
      return userCollectionCanisterIds.has(nft.canister);
    });

    const finalUserNfts = await Promise.all(
      rawAllowedUserNfts.map(async rawNft => {
        const {index} = extjs.decodeTokenId(rawNft.token);

        return {
          ...rawNft,
          image: EntrepotNFTImage(getEXTCanister(rawNft.canister), index, rawNft.token, false, 0),
        };
      }),
    );

    console.log({finalUserNfts, userCollections});
    setUserNfts(finalUserNfts);
    setUserCollections(userCollections);
  }

  React.useEffect(() => {
    refresh();
  }, [props.account]);

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
          display: 'block',
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
        <ProfileBody userNfts={userNfts} userCollections={userCollections} />
      </div>
    </>
  );
}
