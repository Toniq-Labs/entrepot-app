/* global BigInt */
import React from 'react';
import {makeStyles} from '@material-ui/core/styles';
import {
  cssToReactStyleObject,
  toniqFontStyles,
  toniqColors,
  Icp16Icon,
} from '@toniq-labs/design-system';
import axios from 'axios';
import extjs from '../../ic/extjs.js';
import {loadAllUserTokens, getEXTCanister} from '../../utilities/load-tokens';
import {useInterval} from '../../utilities/use-interval';
import {EntrepotNFTImage} from '../../utils';
import {profileStyles} from './ProfileStyles';
import {ChipWithLabel} from '../../shared/ChipWithLabel';
// import {NftCard} from '../components/shared/NftCard';
// import {
//   ToniqIcon,
//   ToniqChip,
//   ToniqInput,
//   ToniqDropdown,
//   ToniqToggleButton,
//   ToniqSlider,
// } from '@toniq-labs/design-system/dist/esm/elements/react-components';

function createFilterCallback(currentFilters, collections) {
  return nft => {
    return true;
  };
}

const ProfileTabs = {
  MyNfts: 'My NFTs',
  Watching: 'Watching',
  Activity: 'Activity',
};

export function Profile(props) {
  const classes = profileStyles();
  const [userCollections, setUserCollections] = React.useState([]);
  const [userNfts, setUserNfts] = React.useState([]);
  const [currentTab, setCurrentTab] = React.useState(ProfileTabs.MyNfts);
  const [currentFilters, setCurrentFilters] = React.useState({});

  async function refresh() {
    console.debug('DOING THE THING');
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
        <div style={{display: 'flex', flexDirection: 'column'}}>
          <h1 className={classes.heading}>My Profile</h1>
          <div style={{display: 'flex', gap: '16px'}}>
            {profileDetails.map(profileDetail => {
              return (
                <ChipWithLabel
                  style={{flexGrow: 0}}
                  label={profileDetail.label}
                  text={profileDetail.text}
                  icon={profileDetail.icon}
                />
              );
            })}
          </div>
        </div>
        <div>
          {userNfts.filter(createFilterCallback(currentFilters, userCollections)).map(userNft => (
            <>
              <span>{userNft.token}</span>
              <br />
            </>
          ))}
        </div>
      </div>
    </>
  );
}
