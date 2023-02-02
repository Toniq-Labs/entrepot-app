import {Collection} from '../../models/collection';
import {BigNumber} from 'bignumber.js';
import {convertToIcpNumber, isBigInt} from '../../icp';
import {CollectionSales, Sales, SalesData, SalesGroup} from '../../models/sales';
import {defaultEntrepotApi} from '../../../api/entrepot-apis/entrepot-data-api';

export async function getCollectionSales(
    collections: Array<Collection>,
): Promise<Array<CollectionSales>> {
    const allLaunchSettings: ReadonlyArray<Sales> = await defaultEntrepotApi
        .canister('uczwa-vyaaa-aaaam-abdba-cai', 'launch')
        .get_all_launch_settings();

    return collections.reduce((result: CollectionSales[], collection: Collection) => {
        const launchSetting = allLaunchSettings.find(launch => {
            return launch.id === collection.id;
        });

        if (launchSetting) {
            const {start, end, quantity, remaining, groups} = launchSetting;

            const publicSaleGroups = groups.filter(currentSale => {
                return currentSale.public;
            });
            let salePrice;

            if (publicSaleGroups !== undefined) {
                salePrice = getSalePrice(publicSaleGroups);
            } else {
                const privateSaleGroups = groups.filter(currentSale => {
                    return !currentSale.public;
                });
                salePrice = getSalePrice(privateSaleGroups);
            }
            salePrice = salePrice ? convertToIcpNumber(salePrice) : 0;

            const formattedData = {
                ...launchSetting,
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
            } as SalesData;

            if (Object.keys(formattedData).length) {
                result.push({
                    ...collection,
                    sales: formattedData,
                });
            }
        }

        return result;
    }, []);
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
