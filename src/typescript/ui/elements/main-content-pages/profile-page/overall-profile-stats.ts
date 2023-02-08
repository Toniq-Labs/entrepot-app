import {ProfilePageStateType} from './profile-page-state';
import {truncateNumber} from '@augment-vir/common';
import {assign, html, isRenderReady} from 'element-vir';
import {Icp16Icon, ToniqChip, toniqFontStyles, ToniqSvg} from '@toniq-labs/design-system';
import {convertToIcpNumber} from '../../../../data/icp';

function calculateOverallProfileStats(profileState: Pick<ProfilePageStateType, 'userOwnedNfts'>) {
    const ready = isRenderReady(profileState.userOwnedNfts);

    const floorValue = ready
        ? truncateNumber(
              convertToIcpNumber(
                  BigInt(
                      profileState.userOwnedNfts.reduce((lowest, nft) => {
                          if (nft.listing.price && nft.listing.price < lowest) {
                              return nft.listing.price;
                          } else {
                              return lowest;
                          }
                      }, Infinity),
                  ),
              ),
          )
        : '-';

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
            count: floorValue,
        },
    ];

    return profileStats;
}

export function createOverallStatsTemplate(
    profileState: Pick<ProfilePageStateType, 'userOwnedNfts'>,
) {
    const stats = calculateOverallProfileStats(profileState);

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
                margin: 0 32px;
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
