import {ProfilePageStateType} from './profile-page-state';
import {truncateNumber} from '@augment-vir/common';
import {assign, html, isRenderReady} from 'element-vir';
import {Icp16Icon, ToniqChip, toniqFontStyles, ToniqSvg} from '@toniq-labs/design-system';
import {convertToIcpNumber} from '../../../../data/icp';
import {CollectionMap} from '../../../../data/models/collection';

function calculateOverallProfileStats(
    profileState: Pick<ProfilePageStateType, 'userOwnedNfts'>,
    collectionMap: CollectionMap,
) {
    const ready = isRenderReady(profileState.userOwnedNfts);

    const floorValue = ready
        ? profileState.userOwnedNfts.reduce((sum, nft): number => {
              const collection = collectionMap[nft.collectionId];

              if (!collection) {
                  console.error(
                      `Failed to find collection by id '${nft.collectionId}' for NFT '${nft.nftId}'`,
                  );
                  return sum;
              }
              if (!collection.stats) {
                  console.error(
                      `No stats yet for collection '${nft.collectionId}', '${collection.name}'  for NFT '${nft.nftId}'`,
                  );
                  return sum;
              }

              const collectionFloor = Number(collection.stats.floor);

              if (isNaN(collectionFloor)) {
                  console.error(
                      `Failed to convert floor price '${collection.stats.floor}' into a number from collection '${nft.collectionId}', '${collection.name}'  for NFT '${nft.nftId}'`,
                  );
                  return sum;
              }

              return sum + collectionFloor;
          }, 0)
        : 0;

    const floorDisplayString =
        ready && !!floorValue ? truncateNumber(convertToIcpNumber(floorValue)) : '-';

    const collectionCount = ready
        ? truncateNumber(new Set(profileState.userOwnedNfts.map(nft => nft.collectionId)).size)
        : '-';

    const profileStats: ReadonlyArray<{title: string; count: string | number; icon?: ToniqSvg}> = [
        {
            title: 'OWNED NFTS',
            count: ready ? truncateNumber(profileState.userOwnedNfts.length) : '-',
        },
        {
            title: 'COLLECTIONS',
            count: collectionCount,
        },
        {
            title: 'FLOOR VALUE',
            icon: Icp16Icon,
            count: floorDisplayString,
        },
    ];

    return profileStats;
}

export function createOverallStatsTemplate(
    profileState: Pick<ProfilePageStateType, 'userOwnedNfts'>,
    collectionMap: CollectionMap,
) {
    const stats = calculateOverallProfileStats(profileState, collectionMap);

    const statTemplates = stats.map(stat => {
        return html`
            <div class="profile-stat-wrapper">
                <div class="profile-stat-title">${stat.title}</div>
                <${ToniqChip}
                    class=${ToniqChip.hostClasses.secondary}
                    ${assign(ToniqChip, {
                        icon: stat.icon,
                        text: String(stat.count),
                    })}
                ></${ToniqChip}>
            </div>
        `;
    });

    return html`
        <style>
            .profile-stats-wrapper {
                display: flex;
                gap: 16px;
                margin: 16px 32px;
            }

            .profile-stat-wrapper {
                min-width: 80px;
                display: flex;
                flex-direction: column;
                gap: 8px;
            }

            .profile-stat-title {
                ${toniqFontStyles.labelFont};
            }
        </style>
        <div class="profile-stats-wrapper">${statTemplates}</div>
    `;
}
