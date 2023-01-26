import {Collection} from '../models/collection';

import {BigNumber} from 'bignumber.js';
import {convertToIcpNumber, isBigInt} from '../icp';
import {Account, CollectionSales, Sales, SalesGroup} from '../models/sales';
import {defaultEntrepotApi} from '../../api/entrepot-data-api';

export async function getCollectionSales(
    collections: Array<Collection>,
    account: Account,
): Promise<Array<CollectionSales>> {
    const salesSettings = await Promise.allSettled(
        collections.map(async collection => {
            return {
                ...collection,
                saleSettings: (await defaultEntrepotApi
                    .canister(collection.canister, 'ext2')
                    .ext_saleSettings(account ? account.address : '')) as Array<Sales>,
                saleCurrent: (await defaultEntrepotApi
                    .canister(collection.canister, 'ext2')
                    .ext_saleCurrent()) as Array<Sales>,
            };
        }),
    );

    const allSales = salesSettings
        .filter(result => {
            return result.status !== 'rejected' && result.value.saleSettings.length;
        })
        .map(result => {
            const {saleSettings, saleCurrent, ...collection} = (
                result as PromiseFulfilledResult<
                    Collection & {saleSettings: Array<Sales>} & {saleCurrent: Array<Sales>}
                >
            ).value;
            const {start, end, quantity, remaining} = saleSettings[0]!;
            const {groups} = saleCurrent[0]!;
            const publicSaleGroups = groups.filter(currentSale => {
                return currentSale.participants?.length === 0;
            });
            let salePrice;
            if (publicSaleGroups !== undefined) {
                salePrice = getSalePrice(publicSaleGroups);
            } else {
                const privateSaleGroups = groups.filter(currentSale => {
                    return currentSale.participants?.length;
                });
                salePrice = getSalePrice(privateSaleGroups);
            }
            salePrice = salePrice ? convertToIcpNumber(salePrice) : 0;

            const formattedData = {
                ...(saleSettings[0] as Sales),
                startDate:
                    start instanceof BigNumber || isBigInt(start) ? Number(start) / 1000000 : start,
                endDate: end instanceof BigNumber || isBigInt(end) ? Number(end) / 1000000 : end,
                percentMinted:
                    Math.round(
                        (((Number(quantity) - Number(remaining)) / Number(quantity)) * 100 +
                            Number.EPSILON) *
                            100,
                    ) / 100,
                groups,
                salePrice,
            };

            return {
                ...collection,
                sales: formattedData,
            };
        });
    return allSales;
}

function getSalePrice(saleGroup: SalesGroup[]) {
    return saleGroup
        .map(saleGroup => {
            return saleGroup.pricing;
        })
        .map(pricing => {
            return pricing.map(price => {
                return price[1];
            });
        })
        .reduce((prevPricing, currentPricing) => {
            return Number(prevPricing) < Number(currentPricing) ? prevPricing : currentPricing;
        })
        .reduce((prevPricing, currentPricing) => {
            return Number(prevPricing) < Number(currentPricing) ? prevPricing : currentPricing;
        });
}
