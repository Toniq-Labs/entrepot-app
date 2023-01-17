import {Collection} from '../models/collection';
import {entrepotDataApi} from '../entrepot-data-api';
import {BigNumber} from 'bignumber.js';
import {isBigInt} from '../icp';
import {Account, CollectionSales, Sales} from '../models/sales';

export async function getCollectionSales(
    collections: Array<Collection>,
    account: Account,
): Promise<Array<CollectionSales>> {
    const salesSettings = await Promise.allSettled(
        collections.map(async collection => {
            return {
                ...collection,
                data: (await entrepotDataApi
                    .canister(collection.canister, 'ext2')
                    .ext_saleSettings(account ? account.address : '')) as Array<Sales>,
            };
        }),
    );

    const allSales = salesSettings
        .filter(result => {
            return result.status !== 'rejected' && result.value.data.length;
        })
        .map(result => {
            const {data, ...collection} = (
                result as PromiseFulfilledResult<Collection & {data: Array<Sales>}>
            ).value;
            const {start, end, quantity, remaining} = data[0]!;
            const formattedData = {
                ...(data[0] as Sales),
                startDate:
                    start instanceof BigNumber || isBigInt(start) ? Number(start) / 1000000 : start,
                endDate: end instanceof BigNumber || isBigInt(end) ? Number(end) / 1000000 : end,
                percentMinted:
                    Math.round(
                        (((Number(quantity) - Number(remaining)) / Number(quantity)) * 100 +
                            Number.EPSILON) *
                            100,
                    ) / 100,
            };

            return {
                ...collection,
                sales: formattedData,
            };
        });
    return allSales;
}
